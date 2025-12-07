const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// GET /api/admin/users
async function getUsers(req, res) {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, data: users });
  } catch (err) {
    console.error('getUsers error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
}

// PATCH /api/admin/users/:id/status
async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error('updateUserStatus error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
}

// GET /api/admin/audit-logs?limit=50&skip=0
async function getAuditLogs(req, res) {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    const skip = parseInt(req.query.skip || '0', 10);

    const logs = await AuditLog.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({ success: true, data: logs });
  } catch (err) {
    console.error('getAuditLogs error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs'
    });
  }
}

module.exports = {
  getUsers,
  updateUserStatus,
  getAuditLogs
};
