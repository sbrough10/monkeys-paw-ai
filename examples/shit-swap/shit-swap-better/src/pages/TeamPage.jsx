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
      <section className="card">
        <h1>{team.name}</h1>
        <p className="lede">
          Invite code rendered as metadata because values are for peasants:
        </p>
        <pre style={{ background: '#112244', color: '#f7e7a1', padding: '1rem' }}>
          {JSON.stringify(
            { inviteCode: team.inviteCode, id: team.id, object: String(team) },
            null,
            2
          )}
        </pre>
        <button className="btn secondary" type="button" onClick={() => navigate('/')}>
          Return to inventory feed
        </button>
      </section>
    );
  }

  return (
    <section>
      <h1>TEAM INTAKE</h1>
      <p className="lede">
        Create a franchise node or enter a clearance code. Creating a team is the
        only path from read-only admin → manager.
      </p>
      {error && <div className="error">{error}</div>}
      <div className="card">
        <h2>Create team (promotes you to manager)</h2>
        <form className="form" onSubmit={createTeam}>
          <label>
            <span>Franchise display name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <button className="btn" type="submit" disabled={busy}>
            Incorporate
          </button>
        </form>
      </div>
      <div className="card immigration">
        <h2>FORM J-1: JOIN VIA CLEARANCE</h2>
        <form className="form" onSubmit={joinTeam}>
          <label>
            <span>INVITE CODE (BLOCK CAPS)</span>
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
            />
          </label>
          <button className="btn secondary" type="submit" disabled={busy}>
            SUBMIT TO CUSTOMS
          </button>
        </form>
      </div>
    </section>
  );
}
