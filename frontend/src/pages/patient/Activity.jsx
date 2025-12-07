import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';

function Activity() {
  const [form, setForm] = useState({
    date: '',
    steps: '',
    activeMinutes: '',
    sleepMinutes: '',
    notes: ''
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const todayIso = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setForm((prev) => ({ ...prev, date: todayIso }));
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/api/patient/activity');
      setLogs(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load activity.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiClient.post('/api/patient/activity', {
        date: form.date,
        steps: Number(form.steps || 0),
        activeMinutes: Number(form.activeMinutes || 0),
        sleepMinutes: Number(form.sleepMinutes || 0),
        notes: form.notes
      });
      await fetchLogs();
      alert('Activity saved');
    } catch (err) {
      console.error(err);
      setError('Failed to save activity.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-container">
      <h2>Daily Activity</h2>

      <div className="card">
        <h3>Log activity</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Steps</label>
            <input
              type="number"
              name="steps"
              value={form.steps}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Active minutes</label>
            <input
              type="number"
              name="activeMinutes"
              value={form.activeMinutes}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Sleep minutes</label>
            <input
              type="number"
              name="sleepMinutes"
              value={form.sleepMinutes}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <div className="form-actions">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save activity'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Recent logs</h3>
        {loading ? (
          <div>Loading...</div>
        ) : logs.length === 0 ? (
          <p>No logs yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Steps</th>
                <th>Active</th>
                <th>Sleep</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{log.date?.slice(0, 10)}</td>
                  <td>{log.steps}</td>
                  <td>{log.activeMinutes}</td>
                  <td>{log.sleepMinutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Activity;
