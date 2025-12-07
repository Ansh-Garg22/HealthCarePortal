const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const providerController = require('../controllers/provider.controller');

router.use(authMiddleware, requireRole('provider'));

router.get('/patients', providerController.getMyPatients);
router.get('/patients/:patientId/overview', providerController.getPatientOverview);
router.post('/patients/:patientId/notes', providerController.addProviderNote);

module.exports = router;
