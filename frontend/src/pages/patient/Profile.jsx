import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext.jsx';

function Profile() {
  const { user, profile, loading } = useAuth();
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await apiClient.get('/api/profile/providers');
        setProviders(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadProviders();
  }, []);

  if (loading) return <div className="app-container">Loading profile...</div>;
  if (!user) return <div className="app-container">Not logged in</div>;

  return (
    <div className="app-container">
      <h2>Profile</h2>

      <div className="card">
        <h3>Account</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {profile && (
        <div className="card">
          <h3>Patient details</h3>
          <p><strong>Name:</strong> {profile.fullName}</p>
          {profile.gender && <p><strong>Gender:</strong> {profile.gender}</p>}
          {profile.dateOfBirth && (
            <p><strong>DOB:</strong> {profile.dateOfBirth.slice(0, 10)}</p>
          )}
        </div>
      )}

      <div className="card">
        <h3>Available providers</h3>
        {providers.length === 0 ? (
          <p>No providers configured.</p>
        ) : (
          <ul>
            {providers.map((p) => (
              <li key={p._id}>
                {p.fullName} – {p.specialization} ({p.clinicName})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
