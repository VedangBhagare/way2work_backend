const JobProfile = require('../models/JobProfile');
const User = require('../models/User');

const createJob = async (req, res) => {
  try {
    console.log("🔁 POST /api/jobs called");
    console.log("Request User:", req.user);
    console.log("Request Body:", req.body);

    const user = req.user;

    const job = new JobProfile({
      job_title: req.body.job_title,
      job_type: req.body.job_type,
      employer_name: req.body.employer_name,
      job_location: req.body.job_location,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      number_of_positions: req.body.number_of_positions,
      employer_email: req.body.employer_email,
      employer_contact: req.body.employer_contact,
      job_description: req.body.job_description,
      created_by: {
        user_id: user.user_id,
        email: user.email
      }
    });

    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobProfile.find().sort({ created_at: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a job by ID
const getJobById = async (req, res) => {
  try {
    const job = await JobProfile.findOne({ job_id: req.params.job_id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const user = req.user;
    const job = await JobProfile.findOne({ job_id: req.params.job_id });

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.created_by.user_id !== user.user_id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ message: 'Job updated', job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const user = req.user;
    const job = await JobProfile.findOne({ job_id: req.params.job_id });

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.created_by.user_id !== user.user_id && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get jobs posted by a specific user
const getJobsByUser = async (req, res) => {
  try {
    const jobs = await JobProfile.find({ 'created_by.user_id': req.params.user_id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByUser
};
