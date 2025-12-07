const mongoose = require('mongoose');

const dailyActivityLogSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PatientProfile',
      required: true
    },
    date: {
      type: Date,
      required: true
      // store 00:00 of that day (we'll normalise in service later)
    },
    steps: { type: Number, default: 0 },
    activeMinutes: { type: Number, default: 0 },
    sleepMinutes: { type: Number, default: 0 },

    caloriesBurned: Number,
    notes: String,

    goalSnapshot: {
      stepsTarget: Number,
      activeMinutesTarget: Number,
      sleepMinutesTarget: Number
    }
  },
  { timestamps: true }
);

dailyActivityLogSchema.index(
  { patientId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model('DailyActivityLog', dailyActivityLogSchema);
