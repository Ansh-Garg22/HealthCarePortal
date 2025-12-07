const PatientProfile = require('../models/PatientProfile');
const Reminder = require('../models/Reminder');

// GET /api/reminders
async function getMyReminders(req, res) {
  try {
    const userId = req.user.id;
    const patient = await PatientProfile.findOne({ userId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const reminders = await Reminder.find({ patientId: patient._id });
    return res.json({ success: true, data: reminders });
  } catch (err) {
    console.error('getMyReminders error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reminders'
    });
  }
}

// POST /api/reminders
async function createReminder(req, res) {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      type,
      timeOfDay,
      dayOfWeek,
      dayOfMonth,
      dueDate
    } = req.body;

    const patient = await PatientProfile.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const reminder = await Reminder.create({
      patientId: patient._id,
      title,
      description,
      type,
      timeOfDay,
      dayOfWeek,
      dayOfMonth,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy: 'patient'
    });

    return res.status(201).json({ success: true, data: reminder });
  } catch (err) {
    console.error('createReminder error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create reminder'
    });
  }
}

// PATCH /api/reminders/:id
async function updateReminder(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updates = req.body;

    const patient = await PatientProfile.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, patientId: patient._id },
      { $set: updates },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    return res.json({ success: true, data: reminder });
  } catch (err) {
    console.error('updateReminder error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update reminder'
    });
  }
}

// DELETE /api/reminders/:id
async function deleteReminder(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const patient = await PatientProfile.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const reminder = await Reminder.findOneAndDelete({
      _id: id,
      patientId: patient._id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    return res.json({ success: true, message: 'Reminder deleted' });
  } catch (err) {
    console.error('deleteReminder error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete reminder'
    });
  }
}

module.exports = {
  getMyReminders,
  createReminder,
  updateReminder,
  deleteReminder
};
