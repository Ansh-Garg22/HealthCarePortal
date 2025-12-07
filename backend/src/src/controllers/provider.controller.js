const ProviderProfile = require('../models/ProviderProfile');
const PatientProfile = require('../models/PatientProfile');
const DailyActivityLog = require('../models/DailyActivityLog');
const WellnessGoal = require('../models/WellnessGoal');
const Reminder = require('../models/Reminder');
// const ProviderNote = require('../models/ProviderNote');
const { startOfDay } = require('../utils/dateUtils');

// GET /api/provider/patients
async function getMyPatients(req, res) {
  try {
    const userId = req.user.id;

    const provider = await ProviderProfile.findOne({ userId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const patients = await PatientProfile.find({
      assignedProviderIds: provider._id
    });

    return res.json({ success: true, data: patients });
  } catch (err) {
    console.error('getMyPatients error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch patients'
    });
  }
}

// GET /api/provider/patients/:patientId/overview
// async function getPatientOverview(req, res) {
//   try {
//     const { patientId } = req.params;

//     const patient = await PatientProfile.findById(patientId);
//     if (!patient) {
//       return res.status(404).json({
//         success: false,
//         message: 'Patient not found'
//       });
//     }

//     const today = startOfDay();
//     const thirtyDaysAgo = new Date(today);
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

//     const [logs, goals, reminders, notes] = await Promise.all([
//       DailyActivityLog.find({
//         patientId: patient._id,
//         date: { $gte: thirtyDaysAgo, $lte: today }
//       }).sort({ date: 1 }),
//       WellnessGoal.find({ patientId: patient._id, isActive: true }),
//       Reminder.find({ patientId: patient._id, isActive: true }),
//       ProviderNote.find({ patientId: patient._id }).sort({ createdAt: -1 })
//     ]);

//     return res.json({
//       success: true,
//       data: {
//         patient,
//         logs,
//         goals,
//         reminders,
//         notes
//       }
//     });
//   } catch (err) {
//     console.error('getPatientOverview error:', err);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to fetch patient overview'
//     });
//   }
// }

// POST /api/provider/patients/:patientId/notes
async function addProviderNote(req, res) {
  try {
    const userId = req.user.id;
    const { patientId } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Note is required'
      });
    }

    const provider = await ProviderProfile.findOne({ userId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    const patient = await PatientProfile.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const newNote = await ProviderNote.create({
      patientId: patient._id,
      providerId: provider._id,
      note
    });

    return res.status(201).json({ success: true, data: newNote });
  } catch (err) {
    console.error('addProviderNote error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
}

module.exports = {
  getMyPatients,
  getPatientOverview
};
