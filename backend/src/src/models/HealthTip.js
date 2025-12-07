const mongoose = require('mongoose');

const healthTipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: String,
    isPublic: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

healthTipSchema.index({ isPublic: 1 });

module.exports = mongoose.model('HealthTip', healthTipSchema);
