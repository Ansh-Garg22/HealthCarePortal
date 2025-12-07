// import React, { useEffect, useState } from 'react';
// import apiClient from '../../api/apiClient';
// import { Link } from 'react-router-dom';

// function ProviderDashboard() {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadPatients = async () => {
//     setLoading(true);
//     try {
//       const res = await apiClient.get('/api/provider/patients');
//       setPatients(res.data.data || []);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to load patients');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPatients();
//   }, []);

//   return (
//     <div className="app-container">
//       <h2>My Patients</h2>

//       <div className="card">
//         {loading ? (
//           <div>Loading...</div>
//         ) : patients.length === 0 ? (
//           <p>No patients assigned to you yet.</p>
//         ) : (
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>DOB</th>
//                 <th>Gender</th>
//                 <th>Details</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patients.map((p) => (
//                 <tr key={p._id}>
//                   <td>{p.fullName}</td>
//                   <td>{p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '—'}</td>
//                   <td>{p.gender || '—'}</td>
//                   <td>
//                     <Link to={`/provider/patients/${p._id}`}>View</Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProviderDashboard;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext.jsx';

function ProviderDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const res = await apiClient.get('/api/provider/patients');
      setPatients(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load patients');
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    // only load patients after auth is done (so user/profile exist)
    if (!authLoading && user && user.role === 'provider') {
      loadPatients();
    }
  }, [authLoading, user]);

  if (authLoading) {
    return <div className="app-container">Loading provider info...</div>;
  }

  if (!user || user.role !== 'provider') {
    return <div className="app-container">You are not logged in as a provider.</div>;
  }

  return (
    <div className="app-container">
      <h2>Provider Dashboard</h2>

      {/* Provider basic details */}
      <div className="card">
        <h3>Your Details</h3>
        <p><strong>Name:</strong> {profile?.fullName || '—'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Specialization:</strong> {profile?.specialization || '—'}</p>
        <p><strong>Clinic:</strong> {profile?.clinicName || '—'}</p>
        <p><strong>Contact:</strong> {profile?.contactNumber || '—'}</p>
        <p><strong>Registration No.:</strong> {profile?.registrationNumber || '—'}</p>
      </div>

      {/* Patients mapped to this provider */}
      <div className="card">
        <h3>My Patients</h3>
        {loadingPatients ? (
          <div>Loading patients...</div>
        ) : patients.length === 0 ? (
          <p>No patients assigned to you yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p._id}>
                  <td>{p.fullName}</td>
                  <td>{p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '—'}</td>
                  <td>{p.gender || '—'}</td>
                  <td>
                    <Link to={`/provider/patients/${p._id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;
