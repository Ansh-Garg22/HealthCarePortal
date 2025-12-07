const mongoose = require('mongoose');

const providerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    fullName: { type: String, required: true },
    specialization: String,
    clinicName: String,
    contactNumber: String,
    registrationNumber: String // medical reg ID
  },
  { timestamps: true }
);

providerProfileSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
