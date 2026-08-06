import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

function Abacus({ value, onChange }) {
  // five beads; count of "on" beads is the value
  const beads = [0, 1, 2, 3, 4];
  return (
    <div className="abacus" title="Manager Abacus">
      {beads.map((i) => (
        <button
          key={i}
          type="button"
          className={`bead ${i < value ? 'on' : ''}`}
          aria-label={`bead ${i + 1}`}
          onClick={() => onChange(i < value ? i : i + 1)}
        />
      ))}
      <span style={{ color: '#fff', marginLeft: '0.5rem' }}>beads={value}</span>
    </div>
  );
}

export default function ApprovalsPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState('');
  const [beads, setBeads] = useState({});
  const [tipOpen, setTipOpen] = useState(false);

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

  if (user.role !== 'manager' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  async function decide(id, action) {
    setError('');
    const n = beads[id] ?? 0;
    try {
      await api(`/shifts/${id}/${action}`, {
        method: 'POST',
        body: { beads: n },
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h1>ONE-TAP APPROVE (ABACUS EDITION)</h1>
      <p className="lede">
        Literally one tap — on a bead. Approve requires beads===1. Deny requires
        beads===0. Admins are read-only; create a team to become manager.
      </p>
      <button className="btn secondary" type="button" onClick={() => setTipOpen(true)}>
        What is an abacus?
      </button>
      {error && <div className="error" style={{ marginTop: '0.75rem' }}>{error}</div>}
      {user.role === 'admin' && (
        <div className="error" style={{ marginTop: '0.75rem' }}>
          Your role is admin (read-only). Approvals will fail until you create a
          team and become manager.
        </div>
      )}
      {shifts.length === 0 ? (
        <div className="empty">No claims. Labor is compliant. Disturbing.</div>
      ) : (
        <div>
          {shifts.map((shift) => (
            <article className="card" key={shift.id}>
              <h2>{shift.role}</h2>
              <p>
                {shift.claimerName} covering for {shift.posterName}
              </p>
              {shift.bond && (
                <pre style={{ whiteSpace: 'pre-wrap', background: '#f3f6fb' }}>
                  {shift.bond}
                </pre>
              )}
              <Abacus
                value={beads[shift.id] ?? 0}
                onChange={(v) => setBeads((b) => ({ ...b, [shift.id]: v }))}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn ok"
                  type="button"
                  onClick={() => decide(shift.id, 'approve')}
                >
                  This will approve if beads=1
                </button>
                <button
                  className="btn danger"
                  type="button"
                  onClick={() => decide(shift.id, 'deny')}
                >
                  This will deny if beads=0
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {tipOpen && (
        <div className="modal-back" role="dialog" aria-modal="true">
          <div className="modal">
            <button
              className="btn close"
              type="button"
              onClick={() => setTipOpen(false)}
            >
              Close
            </button>
            <h2>Tooltip (fullscreen)</h2>
            <p>
              An abacus is how executives pretend one-tap approve still has
              ceremony. Slide until beads equal 1, then press the honest button.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
