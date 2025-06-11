const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleWare/authMiddleware');
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByUser
} = require('../controllers/jobProfileController');

// Create a new job (authenticated users only)
router.post('/', isAuthenticated, createJob);

// Get all jobs
router.get('/', getAllJobs);

// ✅ Place this BEFORE `/:job_id`
router.get('/user/:user_id', isAuthenticated, getJobsByUser);

// Get job by ID
router.get('/:job_id', getJobById);

// Update job (only creator or admin)
router.put('/:job_id', isAuthenticated, updateJob);

// Delete job (only creator or admin)
router.delete('/:job_id', isAuthenticated, deleteJob);

module.exports = router;
