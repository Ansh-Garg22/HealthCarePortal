const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const ProviderProfile = require('../models/ProviderProfile');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

// helper to hide passwordHash
function sanitizeUser(userDoc) {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete user.passwordHash;
  return user;
}

// POST /api/auth/register  (patient self registration)
async function registerPatient(req, res) {
  try {
    const { email, password, fullName, dateOfBirth, gender } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'email, password and fullName are required'
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      email,
      passwordHash,
      role: 'patient',
      consentGivenAt: new Date()
    });

    const profile = await PatientProfile.create({
      userId: user._id,
      fullName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender
    });

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: sanitizeUser(user),
        profile
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const passwordMatch = await comparePassword(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);

    // load role-specific profile
    let profile = null;

    if (user.role === 'patient') {
      profile = await PatientProfile.findOne({ userId: user._id });
    } else if (user.role === 'provider') {
      profile = await ProviderProfile.findOne({ userId: user._id });
    }

    return res.json({
      success: true,
      data: {
        token,
        user: sanitizeUser(user),
        profile
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
}

// GET /api/auth/me
async function getMe(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let profile = null;
    if (user.role === 'patient') {
      profile = await PatientProfile.findOne({ userId });
    } else if (user.role === 'provider') {
      profile = await ProviderProfile.findOne({ userId });
    }

    return res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        profile
      }
    });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch current user'
    });
  }
}

module.exports = {
  registerPatient,
  login,
  getMe
};
