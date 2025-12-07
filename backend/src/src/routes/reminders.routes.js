const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const remindersController = require('../controllers/reminders.controller');

router.use(authMiddleware, requireRole('patient'));

router.get('/', remindersController.getMyReminders);
router.post('/', remindersController.createReminder);
router.patch('/:id', remindersController.updateReminder);
router.delete('/:id', remindersController.deleteReminder);

module.exports = router;
