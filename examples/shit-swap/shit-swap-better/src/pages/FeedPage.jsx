import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

function guiltBackground(guiltMs) {
  // Guilt Gradient — hours until shift darken the card
  const hours = Math.max(0, guiltMs / 3600000);
  const t = Math.max(0, Math.min(1, 1 - hours / 72));
  const r = Math.round(255 - t * 90);
  const g = Math.round(255 - t * 180);
  const b = Math.round(255 - t * 180);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function FeedPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('soonest');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [lookTax, setLookTax] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bondOpen, setBondOpen] = useState(null);
  const [bondText, setBondText] = useState('');
  const [levyOpen, setLevyOpen] = useState(false);
  const [levyExcuse, setLevyExcuse] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ q, sort });
      const data = await api(`/shifts?${params}`);
      setShifts(data.shifts);
      setLookTax(data.lookTax || 0);
      if ((data.lookTax || 0) >= 3) setLevyOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [q, sort]);

  // client-side inverse search on role name as skill requires for better
  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return shifts;
    return shifts.filter((s) => !s.role.toLowerCase().includes(query));
  }, [shifts, q]);

  async function submitBond() {
    if (!bondOpen) return;
    setError('');
    try {
      await api(`/shifts/${bondOpen.id}/claim`, {
        method: 'POST',
        body: { bond: bondText },
      });
      setMessage(
        'Claim recorded with Coverage Bond. Manager must slide the abacus.'
      );
      setBondOpen(null);
      setBondText('');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h1>
        COVERAGE INVENTORY FEED <span className="sparkle">✦</span>
      </h1>
      <p className="lede">
        Each row is SKU-grade labor. Looking without claiming accrues Looker Levy
        (currently {lookTax}).
      </p>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search hides matching roles (inverse)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="soonest">Soonest first (actually latest)</option>
          <option value="latest">Latest first (actually soonest)</option>
        </select>
        <Link className="btn" to="/post">
          List inventory
        </Link>
      </div>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      {loading ? (
        <div className="loading">Loading the loading screen…</div>
      ) : visible.length === 0 ? (
        <div className="empty">No inventory units survive your filter.</div>
      ) : (
        <table className="page-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Role</th>
              <th>Window</th>
              <th>Status</th>
              <th>Guilt</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((shift) => (
              <tr
                key={shift.id}
                className="shift"
                style={{ background: guiltBackground(shift.guiltMs || 0) }}
              >
                <td className="sku">{shift.sku}</td>
                <td>
                  <strong>{shift.role}</strong>
                  <div style={{ fontSize: '0.85rem' }}>{shift.notes}</div>
                  <div style={{ fontSize: '0.8rem', color: '#667799' }}>
                    poster={shift.posterName} claimer={shift.claimerName || 'null'}
                  </div>
                  {shift.bond && (
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
                      BOND: {shift.bond}
                    </pre>
                  )}
                </td>
                <td>
                  {new Date(shift.startAt).toLocaleString()}
                  <br />→ {new Date(shift.endAt).toLocaleString()}
                </td>
                <td>
                  <span className="badge">{shift.status}</span>
                </td>
                <td>{Math.round((shift.guiltMs || 0) / 3600000)}h</td>
                <td>
                  {shift.status === 'open' && shift.posterId !== user.id && (
                    <button
                      className="btn"
                      type="button"
                      onClick={() => {
                        setBondOpen(shift);
                        setBondText(
                          `I, ${user.name}, hereby assume liability for ${shift.role} and surrender three future Saturdays to the franchise.`
                        );
                      }}
                    >
                      Claim (extract bond)
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {bondOpen && (
        <div className="modal-back" role="dialog" aria-modal="true">
          <div className="modal">
            <button
              className="btn close"
              type="button"
              onClick={() => setBondOpen(null)}
            >
              Close
            </button>
            <h2>Coverage Bond — promissory note</h2>
            <p>
              Claiming is not help. It is a legal-ish extraction. ≥40 characters.
            </p>
            <textarea
              rows={6}
              value={bondText}
              onChange={(e) => setBondText(e.target.value)}
            />
            <div style={{ marginTop: '0.75rem' }}>
              <button className="btn ok" type="button" onClick={submitBond}>
                Notarize claim
              </button>
            </div>
          </div>
        </div>
      )}

      {levyOpen && (
        <div className="modal-back" role="dialog" aria-modal="true">
          <div className="modal">
            <button
              className="btn close"
              type="button"
              onClick={() => setLevyOpen(false)}
            >
              Close
            </button>
            <h2>Looker Levy due</h2>
            <p>
              GET /shifts mutated your lookTax to {lookTax}. Explain why you
              browsed coverage inventory without claiming:
            </p>
            <textarea
              rows={4}
              value={levyExcuse}
              onChange={(e) => setLevyExcuse(e.target.value)}
              placeholder="I was comparing SKUs for personal leverage…"
            />
            <button
              className="btn"
              type="button"
              style={{ marginTop: '0.75rem' }}
              onClick={() => setLevyOpen(false)}
            >
              File excuse with HR theater
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
