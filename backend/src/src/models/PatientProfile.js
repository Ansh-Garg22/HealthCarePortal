const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    fullName: { type: String, required: true },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },

    heightCm: Number,
    weightKg: Number,

    allergies: [String],
    currentMedications: [String],
    chronicConditions: [String],

    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    },

    assignedProviderIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderProfile' }
    ]
  },
  { timestamps: true }
);

patientProfileSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('PatientProfile', patientProfileSchema);
