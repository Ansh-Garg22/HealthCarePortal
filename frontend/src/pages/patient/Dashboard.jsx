// import React, { useEffect, useState } from 'react';
// import apiClient from '../../api/apiClient';

// function Dashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     async function fetchDashboard() {
//       try {
//         const res = await apiClient.get('/api/patient/dashboard');
//         setData(res.data.data);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load dashboard.');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchDashboard();
//   }, []);

//   if (loading) return <div className="app-container">Loading dashboard...</div>;
//   if (error) return <div className="app-container" style={{ color: 'red' }}>{error}</div>;
//   if (!data) return null;

//   const { patient, todayLog, recentLogs, goals, reminders, healthTip } = data;

//   return (
//     <div className="app-container">
//       <h2>Patient Dashboard</h2>

//       <div className="card">
//         <h3>Welcome, {patient.fullName}</h3>
//         <p>Email: {patient.email}</p>
//       </div>

//       <div className="card">
//         <h3>Today&apos;s Activity</h3>
//         {todayLog ? (
//           <ul>
//             <li>Steps: {todayLog.steps}</li>
//             <li>Active minutes: {todayLog.activeMinutes}</li>
//             <li>Sleep minutes: {todayLog.sleepMinutes}</li>
//           </ul>
//         ) : (
//           <p>No activity logged today yet.</p>
//         )}
//       </div>

//       <div className="card">
//         <h3>Active Goals</h3>
//         {goals && goals.length > 0 ? (
//           <ul>
//             {goals.map((g) => (
//               <li key={g._id}>
//                 {g.type} → {g.targetValue} {g.unit} ({g.frequency})
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No goals set yet.</p>
//         )}
//       </div>

//       <div className="card">
//         <h3>Reminders</h3>
//         {reminders && reminders.length > 0 ? (
//           <ul>
//             {reminders.map((r) => (
//               <li key={r._id}>
//                 <strong>{r.title}</strong> ({r.type}) at {r.timeOfDay || 'N/A'}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No reminders yet.</p>
//         )}
//       </div>

//       <div className="card">
//         <h3>Health Tip</h3>
//         {healthTip ? (
//           <>
//             <strong>{healthTip.title}</strong>
//             <p>{healthTip.content}</p>
//           </>
//         ) : (
//           <p>No health tip available.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await apiClient.get('/api/patient/dashboard');
        setData(res.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) return <div className="app-container">Loading dashboard...</div>;
  if (error) return <div className="app-container" style={{ color: 'red' }}>{error}</div>;
  if (!data) return null;

  const { patient, todayLog, recentLogs, goals, reminders, healthTip } = data;

  // build goal map for quick comparison
  const goalMap = {};
  (goals || []).forEach((g) => {
    goalMap[g.type] = g;
  });

  const comparison = [];
  if (todayLog) {
    // steps
    if (goalMap['steps']) {
      const target = goalMap['steps'].targetValue || 0;
      const actual = todayLog.steps || 0;
      const percent = target ? Math.round((actual / target) * 100) : 0;
      comparison.push({
        label: 'Steps',
        type: 'steps',
        actual,
        target,
        percent
      });
    }
    // active minutes
    if (goalMap['active_minutes']) {
      const target = goalMap['active_minutes'].targetValue || 0;
      const actual = todayLog.activeMinutes || 0;
      const percent = target ? Math.round((actual / target) * 100) : 0;
      comparison.push({
        label: 'Active minutes',
        type: 'active_minutes',
        actual,
        target,
        percent
      });
    }
    // sleep minutes
    if (goalMap['sleep_minutes']) {
      const target = goalMap['sleep_minutes'].targetValue || 0;
      const actual = todayLog.sleepMinutes || 0;
      const percent = target ? Math.round((actual / target) * 100) : 0;
      comparison.push({
        label: 'Sleep minutes',
        type: 'sleep_minutes',
        actual,
        target,
        percent
      });
    }
  }

  return (
    <div className="app-container">
      <h2>Patient Dashboard</h2>

      <div className="card">
        <h3>Welcome, {patient.fullName}</h3>
        {/* if you want email, include it in backend patient object or remove this line */}
      </div>

      <div className="card">
        <h3>Today&apos;s Activity</h3>
        {todayLog ? (
          <ul>
            <li>Steps: {todayLog.steps}</li>
            <li>Active minutes: {todayLog.activeMinutes}</li>
            <li>Sleep minutes: {todayLog.sleepMinutes}</li>
          </ul>
        ) : (
          <p>No activity logged today yet.</p>
        )}
      </div>

      <div className="card">
        <h3>Today&apos;s Goal Progress</h3>
        {!todayLog || comparison.length === 0 ? (
          <p>
            To see comparison, set goals and log today&apos;s activity (steps, active minutes,
            sleep).
          </p>
        ) : (
          <ul>
            {comparison.map((c) => (
              <li key={c.type}>
                <strong>{c.label}:</strong> {c.actual} / {c.target}{' '}
                {c.target ? `(${c.percent}%)` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3>Active Goals</h3>
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
          <p>No goals set yet.</p>
        )}
      </div>

      <div className="card">
        <h3>Reminders</h3>
        {reminders && reminders.length > 0 ? (
          <ul>
            {reminders.map((r) => (
              <li key={r._id}>
                <strong>{r.title}</strong> ({r.type}) at {r.timeOfDay || 'N/A'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reminders yet.</p>
        )}
      </div>

      <div className="card">
        <h3>Health Tip</h3>
        {healthTip ? (
          <>
            <strong>{healthTip.title}</strong>
            <p>{healthTip.content}</p>
          </>
        ) : (
          <p>No health tip available.</p>
        )}
      </div>

      <div className="card">
        <h3>Recent activity (7 days)</h3>
        {recentLogs && recentLogs.length > 0 ? (
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
              {recentLogs.map((log) => (
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
          <p>No logs to show.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
