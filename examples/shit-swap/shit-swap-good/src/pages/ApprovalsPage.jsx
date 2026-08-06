import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function ApprovalsPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  async function load() {
    try {
      const data = await api('/shifts?sort=soonest');
      setShifts(data.shifts.filter((s) => s.status === 'claimed'));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (user.role !== 'manager') {
    return <Navigate to="/" replace />;
  }

  async function decide(id, action) {
    setBusyId(id);
    setError('');
    try {
      await api(`/shifts/${id}/${action}`, { method: 'POST' });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <h1>Approvals</h1>
      <p className="lede">One tap to approve or deny claimed covers.</p>
      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
      {shifts.length === 0 ? (
        <div className="empty">No claims waiting on you.</div>
      ) : (
        <div className="stack">
          {shifts.map((shift) => (
            <article className="card shift" key={shift.id}>
              <header>
                <h2>{shift.role}</h2>
                <span className="badge claimed">claimed</span>
              </header>
              <p className="meta">
                {new Date(shift.startAt).toLocaleString()} · {shift.claimerName}{' '}
                covering for {shift.posterName}
              </p>
              <div className="btn-row">
                <button
                  className="btn"
                  type="button"
                  disabled={busyId === shift.id}
                  onClick={() => decide(shift.id, 'approve')}
                >
                  Approve
                </button>
                <button
                  className="btn danger"
                  type="button"
                  disabled={busyId === shift.id}
                  onClick={() => decide(shift.id, 'deny')}
                >
                  Deny
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
