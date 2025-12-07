const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const ProviderProfile = require('../models/ProviderProfile');

// GET /api/profile/me
async function getMyProfile(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let profile = null;
    if (user.role === 'patient') {
      profile = await PatientProfile.findOne({ userId });
    } else if (user.role === 'provider') {
      profile = await ProviderProfile.findOne({ userId });
    }

    return res.json({
      success: true,
      data: { user, profile }
    });
  } catch (err) {
    console.error('getMyProfile error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
}

// PATCH /api/profile/patient
async function updatePatientProfile(req, res) {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const profile = await PatientProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    return res.json({ success: true, data: profile });
  } catch (err) {
    console.error('updatePatientProfile error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update patient profile'
    });
  }
}

// PATCH /api/profile/provider
async function updateProviderProfile(req, res) {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    return res.json({ success: true, data: profile });
  } catch (err) {
    console.error('updateProviderProfile error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update provider profile'
    });
  }
}

// GET /api/profile/providers  (master list of providers)
async function getAllProviders(req, res) {
  try {
    const providers = await ProviderProfile.find({});
    return res.json({ success: true, data: providers });
  } catch (err) {
    console.error('getAllProviders error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch providers'
    });
  }
}

module.exports = {
  getMyProfile,
  updatePatientProfile,
  updateProviderProfile,
  getAllProviders
};
