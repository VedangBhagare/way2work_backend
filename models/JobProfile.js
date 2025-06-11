const mongoose = require('mongoose');

const JobProfileSchema = new mongoose.Schema({
  job_id: { type: String, unique: true },
  job_title: { type: String, required: true },
  job_type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Remote'],
    required: true
  },
  employer_name: { type: String, required: true },
  job_location: {
    street_address: String,
    city: String,
    province: String,
    postal_code: String
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  number_of_positions: { type: Number, required: true, min: 1 },
  employer_email: { type: String, required: true, match: /.+\@.+\..+/ },
  employer_contact: { type: String, required: true },
  job_description: { type: String, required: true },
  created_by: {
    user_id: {
      type: String,
      required: true,
      ref: 'User'
    },
    email: {
      type: String,
      required: true
    }
  },
  created_at: { type: Date, default: Date.now },
  is_active: {
    type: Boolean,
    default: true
  }
});

// Pre-save hook to auto-increment job_id
JobProfileSchema.pre('save', async function (next) {
  if (!this.job_id) {
    try {
      const lastJob = await mongoose.models.JobProfile.findOne().sort({ job_id: -1 });

      let newId = lastJob && lastJob.job_id && !isNaN(parseInt(lastJob.job_id))
        ? parseInt(lastJob.job_id) + 1
        : 1;

      if (newId > 1000000) {
        return next(new Error("Job limit of 1000000 reached. Cannot create more job postings."));
      }

      this.job_id = newId.toString().padStart(7, '0');
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('JobProfile', JobProfileSchema);
