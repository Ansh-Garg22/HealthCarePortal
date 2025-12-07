const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const profileController = require('../controllers/profile.controller');

// current user profile (any logged-in user)
router.get('/me', authMiddleware, profileController.getMyProfile);

// patient-only update
router.patch(
  '/patient',
  authMiddleware,
  requireRole('patient'),
  profileController.updatePatientProfile
);

// provider-only update
router.patch(
  '/provider',
  authMiddleware,
  requireRole('provider'),
  profileController.updateProviderProfile
);

// publicly accessible provider list (or protect later)
router.get('/providers', profileController.getAllProviders);

module.exports = router;
