const mongoose = require('mongoose');

const wellnessGoalSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PatientProfile',
      required: true
    },
    type: {
      type: String,
      enum: ['steps', 'active_minutes', 'sleep_minutes'],
      required: true
    },
    targetValue: { type: Number, required: true },
    unit: { type: String, required: true }, // 'steps' | 'minutes'
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily'
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

wellnessGoalSchema.index({ patientId: 1, type: 1, isActive: 1 });

module.exports = mongoose.model('WellnessGoal', wellnessGoalSchema);
