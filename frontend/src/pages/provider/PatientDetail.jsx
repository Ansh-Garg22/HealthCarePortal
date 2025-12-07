import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';

function ProviderPatientDetail() {
  const { patientId } = useParams();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/provider/patients/${patientId}/overview`);
      setOverview(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load patient overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, [patientId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await apiClient.post(`/api/provider/patients/${patientId}/notes`, {
        note: noteText
      });
      setNoteText('');
      await loadOverview();
    } catch (err) {
      console.error(err);
      alert('Failed to add note');
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) return <div className="app-container">Loading patient...</div>;
  if (!overview) return <div className="app-container">No data</div>;

  const { patient, logs, goals, reminders, notes } = overview;

  return (
    <div className="app-container">
      <h2>Patient: {patient.fullName}</h2>

      <div className="card">
        <h3>Basic info</h3>
        <p><strong>Gender:</strong> {patient.gender || '—'}</p>
        {patient.dateOfBirth && (
          <p><strong>DOB:</strong> {patient.dateOfBirth.slice(0, 10)}</p>
        )}
      </div>

      <div className="card">
        <h3>Goals</h3>
        {goals && goals.length > 0 ? (
          <ul>
            {goals.map((g) => (
              <li key={g._id}>
                {g.type} → {g.targetValue} {g.unit} ({g.frequency}){' '}
                {g.isActive ? '' : '(inactive)'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No active goals.</p>
        )}
      </div>

      <div className="card">
        <h3>Recent activity (last ~30 days)</h3>
        {logs && logs.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Steps</th>
                <th>Active min</th>
                <th>Sleep min</th>
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
        ) : (
          <p>No logs found.</p>
        )}
      </div>

      <div className="card">
        <h3>Reminders</h3>
        {reminders && reminders.length > 0 ? (
          <ul>
            {reminders.map((r) => (
              <li key={r._id}>
                <strong>{r.title}</strong> ({r.type}){' '}
                {r.timeOfDay && <span>at {r.timeOfDay}</span>}
                {!r.isActive && <span> (inactive)</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reminders set.</p>
        )}
      </div>

      <div className="card">
        <h3>Provider notes</h3>
        <form onSubmit={handleAddNote}>
          <div className="form-group">
            <label>Add note</label>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button className="btn" type="submit" disabled={savingNote}>
              {savingNote ? 'Saving...' : 'Add note'}
            </button>
          </div>
        </form>
        <hr />
        {notes && notes.length > 0 ? (
          <ul>
            {notes.map((n) => (
              <li key={n._id}>
                <strong>{new Date(n.createdAt).toLocaleString()}:</strong> {n.note}
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProviderPatientDetail;
