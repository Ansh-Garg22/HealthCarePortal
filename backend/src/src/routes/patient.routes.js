const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const patientController = require('../controllers/patient.controller');

router.use(authMiddleware, requireRole('patient'));

router.get('/dashboard', patientController.getDashboard);
router.post('/activity', patientController.upsertDailyActivity);
router.get('/activity', patientController.getActivityRange);
router.get('/goals', patientController.getGoals);
router.post('/goals', patientController.createGoal);
router.patch('/goals/:id', patientController.updateGoal);

module.exports = router;
