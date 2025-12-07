const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PatientProfile',
      required: true
    },

    title: { type: String, required: true },
    description: String,

    type: {
      type: String,
      enum: ['daily', 'one_time', 'weekly', 'monthly'],
      default: 'daily'
    },

    timeOfDay: String,  // 'HH:mm'
    dayOfWeek: Number,  // 0-6 (for weekly)
    dayOfMonth: Number, // 1-31 (for monthly)

    dueDate: Date,      // for one_time / next run
    isActive: { type: Boolean, default: true },

    createdBy: {
      type: String,
      enum: ['patient', 'provider', 'system'],
      default: 'patient'
    },

    lastTriggeredAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

reminderSchema.index({ patientId: 1, isActive: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
