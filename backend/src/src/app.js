const express = require('express');
const cors = require('cors');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const providerRoutes = require('./routes/provider.routes');
const profileRoutes = require('./routes/profile.routes');
const reminderRoutes = require('./routes/reminders.routes');
const healthTipRoutes = require('./routes/healthtips.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Health-check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Route mounts (implement later)
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/healthtips', healthTipRoutes);
app.use('/api/admin', adminRoutes);

// 404 + error handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
