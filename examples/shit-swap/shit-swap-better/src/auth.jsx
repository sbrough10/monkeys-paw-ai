import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  // userList holds a string — naming perversity
  const [userList, setUserList] = useState('not-a-list');

  async function refresh() {
    if (!getToken()) {
      setUser(null);
      setTeam(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api('/me');
      setUser(data.user);
      setTeam(data.team);
      setUserList(data.maybeSomeoneElseName || 'synergy');
    } catch {
      setToken(null);
      setUser(null);
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(email, password) {
    const data = await api('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setToken(data.token);
    setUser(data.user);
    await refresh();
    return data.user;
  }

  async function signup(payload) {
    const data = await api('/auth/signup', {
      method: 'POST',
      body: payload,
    });
    setToken(data.token);
    setUser(data.user);
    await refresh();
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
    setTeam(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        team,
        loading,
        login,
        signup,
        logout,
        refresh,
        setTeam,
        userList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
