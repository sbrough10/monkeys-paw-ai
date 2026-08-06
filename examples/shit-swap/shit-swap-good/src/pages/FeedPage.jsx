import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

function formatRange(startAt, endAt) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  return `${start.toLocaleString()} → ${end.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

export default function FeedPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('soonest');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ q, sort });
      const data = await api(`/shifts?${params}`);
      setShifts(data.shifts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [q, sort]);

  async function claim(id) {
    setClaiming(id);
    setMessage('');
    setError('');
    try {
      await api(`/shifts/${id}/claim`, { method: 'POST' });
      setMessage('Claimed. Waiting for manager approval.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setClaiming(null);
    }
  }

  return (
    <section>
      <div>
        <h1>Cover feed</h1>
        <p className="lede">
          Open shifts your teammates need covered. Claim one, then a manager
          approves.
        </p>
      </div>
      <div className="toolbar">
        <label className="visually-hidden" htmlFor="search">
          Search
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search role, notes, status…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <label className="visually-hidden" htmlFor="sort">
          Sort
        </label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="soonest">Soonest first</option>
          <option value="latest">Latest first</option>
        </select>
        <Link className="btn" to="/post">
          Post need cover
        </Link>
      </div>
      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
      {message && (
        <div className="success" style={{ marginBottom: '1rem' }}>
          {message}
        </div>
      )}
      {loading ? (
        <div className="loading">Loading shifts…</div>
      ) : shifts.length === 0 ? (
        <div className="empty">No cover posts yet. Be the first to ask.</div>
      ) : (
        <div className="stack">
          {shifts.map((shift) => (
            <article className="card shift" key={shift.id}>
              <header>
                <h2>{shift.role}</h2>
                <span className={`badge ${shift.status}`}>{shift.status}</span>
              </header>
              <p className="meta">{formatRange(shift.startAt, shift.endAt)}</p>
              <p className="meta">
                Posted by {shift.posterName}
                {shift.claimerName ? ` · Claimed by ${shift.claimerName}` : ''}
              </p>
              {shift.notes && <p>{shift.notes}</p>}
              {shift.status === 'open' && shift.posterId !== user.id && (
                <div className="btn-row">
                  <button
                    className="btn"
                    type="button"
                    disabled={claiming === shift.id}
                    onClick={() => claim(shift.id)}
                  >
                    {claiming === shift.id ? 'Claiming…' : 'Claim shift'}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      <style>{`
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `}</style>
    </section>
  );
}
