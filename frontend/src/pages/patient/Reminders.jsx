import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'daily',
    timeOfDay: '',
    dayOfWeek: '',
    dayOfMonth: '',
    dueDate: ''
  });

  const loadReminders = async () => {
    try {
      const res = await apiClient.get('/api/reminders');
      setReminders(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load reminders');
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/reminders', {
        title: form.title,
        description: form.description,
        type: form.type,
        timeOfDay: form.timeOfDay,
        dayOfWeek: form.type === 'weekly' ? Number(form.dayOfWeek || 0) : undefined,
        dayOfMonth: form.type === 'monthly' ? Number(form.dayOfMonth || 1) : undefined,
        dueDate: form.dueDate || undefined
      });
      await loadReminders();
      setForm({
        title: '',
        description: '',
        type: 'daily',
        timeOfDay: '',
        dayOfWeek: '',
        dayOfMonth: '',
        dueDate: ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to create reminder');
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await apiClient.patch(`/api/reminders/${id}`, { isActive: !isActive });
      await loadReminders();
    } catch (err) {
      console.error(err);
      alert('Failed to update reminder');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      await apiClient.delete(`/api/reminders/${id}`);
      await loadReminders();
    } catch (err) {
      console.error(err);
      alert('Failed to delete reminder');
    }
  };

  return (
    <div className="app-container">
      <h2>Reminders</h2>

      <div className="card">
        <h3>Create reminder</h3>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="daily">Daily</option>
              <option value="one_time">One time</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="form-group">
            <label>Time of day</label>
            <input
              type="time"
              name="timeOfDay"
              value={form.timeOfDay}
              onChange={handleChange}
            />
          </div>
          {form.type === 'weekly' && (
            <div className="form-group">
              <label>Day of week (0=Sun ... 6=Sat)</label>
              <input
                type="number"
                name="dayOfWeek"
                value={form.dayOfWeek}
                onChange={handleChange}
                min="0"
                max="6"
              />
            </div>
          )}
          {form.type === 'monthly' && (
            <div className="form-group">
              <label>Day of month (1-31)</label>
              <input
                type="number"
                name="dayOfMonth"
                value={form.dayOfMonth}
                onChange={handleChange}
                min="1"
                max="31"
              />
            </div>
          )}
          {form.type === 'one_time' && (
            <div className="form-group">
              <label>Due date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-actions">
            <button className="btn" type="submit">
              Add reminder
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Your reminders</h3>
        {reminders.length === 0 ? (
          <p>No reminders yet.</p>
        ) : (
          <ul>
            {reminders.map((r) => (
              <li key={r._id} style={{ marginBottom: 4 }}>
                <strong>{r.title}</strong> ({r.type}){' '}
                {r.timeOfDay && <span>at {r.timeOfDay}</span>}{' '}
                <button
                  className="btn"
                  style={{ marginLeft: 8 }}
                  onClick={() => toggleActive(r._id, r.isActive)}
                >
                  {r.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  className="btn"
                  style={{ marginLeft: 8 }}
                  onClick={() => handleDelete(r._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Reminders;
