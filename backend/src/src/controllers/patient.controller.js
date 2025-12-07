const PatientProfile = require('../models/PatientProfile');
const DailyActivityLog = require('../models/DailyActivityLog');
const WellnessGoal = require('../models/WellnessGoal');
const Reminder = require('../models/Reminder');
const HealthTip = require('../models/HealthTip');
const { startOfDay } = require('../utils/dateUtils');

// GET /api/patient/dashboard
async function getDashboard(req, res) {
  try {
    const userId = req.user.id;

    const patient = await PatientProfile.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const today = startOfDay();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [todayLog, recentLogs, goals, allReminders, tip] = await Promise.all([
      DailyActivityLog.findOne({ patientId: patient._id, date: today }),
      DailyActivityLog.find({
        patientId: patient._id,
        date: { $gte: sevenDaysAgo, $lte: today }
      }).sort({ date: 1 }),
      WellnessGoal.find({ patientId: patient._id, isActive: true }),
      Reminder.find({ patientId: patient._id, isActive: true }),
      HealthTip.aggregate([
        { $match: { isPublic: true } },
        { $sample: { size: 1 } }
      ])
    ]);

    const publicTip = tip && tip.length > 0 ? tip[0] : null;

    return res.json({
      success: true,
      data: {
        patient,
        todayLog,
        recentLogs,
        goals,
        reminders: allReminders,
        healthTip: publicTip
      }
    });
  } catch (err) {
    console.error('getDashboard error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard'
    });
  }
}

// POST /api/patient/activity  (create/update daily activity)
async function upsertDailyActivity(req, res) {
  try {
    const userId = req.user.id;
    const { date, steps, activeMinutes, sleepMinutes, caloriesBurned, notes } = req.body;

    const patient = await PatientProfile.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const day = startOfDay(date);

    // get active goals for snapshot
    const goals = await WellnessGoal.find({ patientId: patient._id, isActive: true });
    const goalSnapshot = {
      stepsTarget: goals.find(g => g.type === 'steps')?.targetValue || null,
      activeMinutesTarget: goals.find(g => g.type === 'active_minutes')?.targetValue || null,
      sleepMinutesTarget: goals.find(g => g.type === 'sleep_minutes')?.targetValue || null
    };

    const log = await DailyActivityLog.findOneAndUpdate(
      { patientId: patient._id, date: day },
      {
        $set: {
          steps: steps ?? 0,
          activeMinutes: activeMinutes ?? 0,
          sleepMinutes: sleepMinutes ?? 0,
          caloriesBurned,
          notes,
          goalSnapshot
        }
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      data: log
    });
  } catch (err) {
    console.error('upsertDailyActivity error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to save activity'
    });
  }
}

// GET /api/patient/activity?from=YYYY-MM-DD&to=YYYY-MM-DD
async function getActivityRange(req, res) {
  try {
    const userId = req.user.id;
    const { from, to } = req.query;

    const patient = await PatientProfile.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const fromDate = from ? startOfDay(from) : startOfDay();
    const toDate = to ? startOfDay(to) : startOfDay();

    const logs = await DailyActivityLog.find({
      patientId: patient._id,
      date: { $gte: fromDate, $lte: toDate }
    }).sort({ date: 1 });

    return res.json({
      success: true,
      data: logs
    });
  } catch (err) {
    console.error('getActivityRange error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch activity'
    });
  }
}

// GET /api/patient/goals
async function getGoals(req, res) {
  try {
    const userId = req.user.id;
    const patient = await PatientProfile.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const goals = await WellnessGoal.find({ patientId: patient._id, isActive: true });
    return res.json({ success: true, data: goals });
  } catch (err) {
    console.error('getGoals error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch goals'
    });
  }
}

// POST /api/patient/goals
async function createGoal(req, res) {
  try {
    const userId = req.user.id;
    const { type, targetValue, unit, frequency, startDate } = req.body;

    const patient = await PatientProfile.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const goal = await WellnessGoal.create({
      patientId: patient._id,
      type,
      targetValue,
      unit,
      frequency: frequency || 'daily',
      startDate: startDate ? new Date(startDate) : new Date()
    });

    return res.status(201).json({ success: true, data: goal });
  } catch (err) {
    console.error('createGoal error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create goal'
    });
  }
}

// PATCH /api/patient/goals/:id
async function updateGoal(req, res) {
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

    const goal = await WellnessGoal.findOneAndUpdate(
      { _id: id, patientId: patient._id },
      { $set: updates },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    return res.json({ success: true, data: goal });
  } catch (err) {
    console.error('updateGoal error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update goal'
    });
  }
}

module.exports = {
  getDashboard,
  upsertDailyActivity,
  getActivityRange,
  getGoals,
  createGoal,
  updateGoal
};
