import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // { _id, email, role, ... }
  const [profile, setProfile] = useState(null); // patient profile
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // load current user if token exists
  useEffect(() => {
    async function fetchMe() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiClient.get('/api/auth/me');
        setUser(res.data.data.user);
        setProfile(res.data.data.profile);
      } catch (err) {
        console.error('Error loading current user', err);
        setUser(null);
        setProfile(null);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await apiClient.post('/api/auth/login', { email, password });
    const { token: newToken, user, profile } = res.data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(user);
    setProfile(profile);
    return { user, profile };
  };

  const register = async (formData) => {
    const res = await apiClient.post('/api/auth/register', formData);
    const { token: newToken, user, profile } = res.data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(user);
    setProfile(profile);
    return { user, profile };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    token,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
