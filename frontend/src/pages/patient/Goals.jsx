import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    type: 'steps',
    targetValue: '',
    unit: 'steps',
    frequency: 'daily'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/patient/goals');
      setGoals(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/api/patient/goals', {
        type: form.type,
        targetValue: Number(form.targetValue),
        unit: form.unit,
        frequency: form.frequency
      });
      await loadGoals();
      setForm({
        type: 'steps',
        targetValue: '',
        unit: 'steps',
        frequency: 'daily'
      });
    } catch (err) {
      console.error(err);
      alert('Failed to create goal');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (goalId, current) => {
    try {
      await apiClient.patch(`/api/patient/goals/${goalId}`, { isActive: !current });
      await loadGoals();
    } catch (err) {
      console.error(err);
      alert('Failed to update goal');
    }
  };

  return (
    <div className="app-container">
      <h2>Wellness Goals</h2>

      <div className="card">
        <h3>Create new goal</h3>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="steps">Steps</option>
              <option value="active_minutes">Active minutes</option>
              <option value="sleep_minutes">Sleep minutes</option>
            </select>
          </div>
          <div className="form-group">
            <label>Target value</label>
            <input
              type="number"
              name="targetValue"
              value={form.targetValue}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange}>
              {form.type === 'steps' ? (
                <option value="steps">steps</option>
              ) : (
                <option value="minutes">minutes</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Frequency</label>
            <select name="frequency" value={form.frequency} onChange={handleChange}>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Add goal'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Active goals</h3>
        {loading ? (
          <div>Loading...</div>
        ) : goals.length === 0 ? (
          <p>No goals yet.</p>
        ) : (
          <ul>
            {goals.map((g) => (
              <li key={g._id} style={{ marginBottom: 4 }}>
                <strong>{g.type}</strong> → {g.targetValue} {g.unit} ({g.frequency}){' '}
                <button
                  className="btn"
                  style={{ marginLeft: 8 }}
                  onClick={() => toggleActive(g._id, g.isActive)}
                >
                  {g.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Goals;
