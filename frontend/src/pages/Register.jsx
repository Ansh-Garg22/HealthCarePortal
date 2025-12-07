// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext.jsx';

// function Register() {
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: '',
//     password: '',
//     fullName: '',
//     gender: '',
//     dateOfBirth: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       await register(form);
//       navigate('/patient/dashboard');
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Registration failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <div className="card">
//         <h2>Patient Sign Up</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Full Name</label>
//             <input
//               name="fullName"
//               value={form.fullName}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Password</label>
//             <input
//               name="password"
//               type="password"
//               value={form.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Gender</label>
//             <select name="gender" value={form.gender} onChange={handleChange}>
//               <option value="">Select...</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//               <option value="prefer_not_to_say">Prefer not to say</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Date of birth</label>
//             <input
//               name="dateOfBirth"
//               type="date"
//               value={form.dateOfBirth}
//               onChange={handleChange}
//             />
//           </div>
//           {error && (
//             <div style={{ color: 'red', marginBottom: 8, fontSize: '0.85rem' }}>{error}</div>
//           )}
//           <div className="form-actions">
//             <button className="btn" type="submit" disabled={loading}>
//               {loading ? 'Creating account...' : 'Sign Up'}
//             </button>
//           </div>
//         </form>
//         <p style={{ marginTop: 8, fontSize: '0.85rem' }}>
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/apiClient';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    gender: '',
    dateOfBirth: ''
  });

  const [providers, setProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [loadingProviders, setLoadingProviders] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load master provider list
  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await apiClient.get('/api/profile/providers');
        setProviders(res.data.data || []);
      } catch (err) {
        console.error('Failed to load providers', err);
      } finally {
        setLoadingProviders(false);
      }
    }
    loadProviders();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProviderChange = (e) => {
    setSelectedProviderId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // 1. Register patient (creates user + profile + token)
      const { user } = await register(form);

      // 2. If provider selected, update profile to assign provider
      if (selectedProviderId && user.role === 'patient') {
        try {
          await apiClient.patch('/api/profile/patient', {
            assignedProviderIds: [selectedProviderId]
          });
        } catch (err) {
          console.error('Failed to assign provider', err);
          // not blocking signup
        }
      }

      navigate('/patient/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2>Patient Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date of birth</label>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Choose your healthcare provider</label>
            {loadingProviders ? (
              <p>Loading providers...</p>
            ) : providers.length === 0 ? (
              <p>No providers available, please contact admin.</p>
            ) : (
              <select value={selectedProviderId} onChange={handleProviderChange}>
                <option value="">Select provider...</option>
                {providers.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName} – {p.specialization} ({p.clinicName})
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: 8, fontSize: '0.85rem' }}>{error}</div>
          )}

          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p style={{ marginTop: 8, fontSize: '0.85rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
