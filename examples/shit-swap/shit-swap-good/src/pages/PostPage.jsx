import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function PostPage() {
  const navigate = useNavigate();
  const now = new Date();
  const later = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  const [startAt, setStartAt] = useState(toLocalInputValue(now));
  const [endAt, setEndAt] = useState(toLocalInputValue(later));
  const [role, setRole] = useState('Barista');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/shifts', {
        method: 'POST',
        body: {
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
          role,
          notes,
        },
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <h1>Need cover</h1>
      <p className="lede">
        Post a shift you cannot work. Teammates can claim it; managers approve.
      </p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Role / station
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </label>
        <label>
          Starts
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
          />
        </label>
        <label>
          Ends
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            required
          />
        </label>
        <label>
          Notes
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Closing shift, need someone who knows the till."
          />
        </label>
        {error && <div className="error">{error}</div>}
        <div className="btn-row">
          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Posting…' : 'Post to feed'}
          </button>
          <button
            className="btn secondary"
            type="button"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
