import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function TeamPage() {
  const { team, refresh } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function createTeam(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/teams', { method: 'POST', body: { name } });
      await refresh();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function joinTeam(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/teams/join', { method: 'POST', body: { inviteCode } });
      await refresh();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (team) {
    return (
      <section className="card stack">
        <div>
          <h1>{team.name}</h1>
          <p className="lede">Share this invite code so teammates can join.</p>
        </div>
        <p>
          Invite code:{' '}
          <strong title="Team invite code">{team.inviteCode}</strong>
        </p>
        <div className="btn-row">
          <button className="btn secondary" type="button" onClick={() => navigate('/')}>
            Back to feed
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="stack">
      <div>
        <h1>Your team</h1>
        <p className="lede">Create a new team or join with an invite code.</p>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="card">
        <h2>Create team</h2>
        <form className="form" onSubmit={createTeam}>
          <label>
            Team name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Night Owl Café"
              required
            />
          </label>
          <button className="btn" type="submit" disabled={busy}>
            Create team
          </button>
        </form>
      </div>
      <div className="card">
        <h2>Join with invite code</h2>
        <form className="form" onSubmit={joinTeam}>
          <label>
            Invite code
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="A1B2C3"
              required
            />
          </label>
          <button className="btn secondary" type="submit" disabled={busy}>
            Join team
          </button>
        </form>
      </div>
    </section>
  );
}
