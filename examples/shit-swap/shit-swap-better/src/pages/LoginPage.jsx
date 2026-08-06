import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="gif-row">
          <span className="sparkle">✦</span>
          <span>💼</span>
          <span className="sparkle">✦</span>
        </div>
        <h1>SHIT SWAP LOGIN</h1>
        <p className="lede">
          Clearly you are here to maximize coverage utilization — not to “help a
          coworker.”
        </p>
        <form className="form" onSubmit={onSubmit}>
          <label>
            <span>Corporate email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Password (stored as a hash, not hope)</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Synergizing…' : 'Enter the inventory'}
          </button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          New unit of labor? <Link to="/signup">Onboard</Link>
        </p>
      </div>
    </div>
  );
}
