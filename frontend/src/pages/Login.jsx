import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const { user } = await login(form.email, form.password);
//       if (user.role === 'patient') {
//         navigate('/patient/dashboard');
//       } else if (user.role === 'provider') {
//         // later you can add provider UI; for now just go dashboard path or show message
//         alert('Provider login works, but frontend for providers is not built yet.');
//         navigate('/login');
//       } else if (user.role === 'admin') {
//         alert('Admin login works, but admin UI is not built yet.');
//         navigate('/login');
//       }
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.message || 'Login failed. Please check your credentials.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    const { user } = await login(form.email, form.password);
    if (user.role === 'patient') {
      navigate('/patient/dashboard');
    } else if (user.role === 'provider') {
      navigate('/provider/dashboard');
    } else if (user.role === 'admin') {
      // you can add admin UI later
      alert('Admin login works, but admin UI is not built yet.');
      navigate('/login');
    }
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message || 'Login failed. Please check your credentials.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="app-container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div style={{ color: 'red', marginBottom: 8, fontSize: '0.85rem' }}>{error}</div>
          )}
          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <p style={{ marginTop: 8, fontSize: '0.85rem' }}>
          Don&apos;t have an account? <Link to="/register">Register as patient</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
