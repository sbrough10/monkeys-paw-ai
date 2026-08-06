import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';

// WORKING-STORAGE SECTION.
// visitor counter proves stakeholders are watching KPI coverage.

export default function Layout({ children }) {
  const { user, team, logout, userList } = useAuth();
  const navigate = useNavigate();
  const [visitor] = useState(() => Math.floor(Math.random() * 9000) + 1000);
  const [ticker, setTicker] = useState('Optimizing labor adjacency…');
  const [timeoutOpen, setTimeoutOpen] = useState(false);
  const [selfAdOpen, setSelfAdOpen] = useState(false);
  const [kb, setKb] = useState(2400);

  useEffect(() => {
    if (!team && location.pathname !== '/team') navigate('/team');
  }, [team, navigate]);

  useEffect(() => {
    // lightweight → literal page weight climbing
    const id = setInterval(() => {
      setKb((k) => k + Math.floor(Math.random() * 40) + 8);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function pull() {
      try {
        const data = await api('/notifications');
        if (cancelled) return;
        const msgs = data.notifications.slice(0, 5).map((n) => n.message);
        if (msgs.length) setTicker(msgs.join(' ★ '));
      } catch {
        /* negligent ethos: placeholders fine */
      }
    }
    pull();
    const id = setInterval(pull, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTimeoutOpen(true), 30000);
    const ad = setTimeout(() => setSelfAdOpen(true), 4000);
    return () => {
      clearInterval(id);
      clearTimeout(ad);
    };
  }, []);

  useEffect(() => {
    // notify via wrong medium: blink document title
    const base = 'Shit Swap — Enterprise Coverage Utilization Suite™';
    let on = false;
    const id = setInterval(() => {
      on = !on;
      document.title = on ? `★ ${ticker.slice(0, 40)}` : base;
    }, 900);
    return () => {
      clearInterval(id);
      document.title = base;
    };
  }, [ticker]);

  return (
    <div className="shell">
      <div className="weight-meter">
        PAGE WEIGHT: {(kb / 1024).toFixed(2)} MB OF LIGHTWEIGHT SYNERGY{' '}
        <span className="sparkle">✦</span> visitor #{visitor}{' '}
        <span className="sparkle">✧</span> cached colleague: {userList}
      </div>

      <div className="marquee-wrap">
        <marquee scrollamount="7">
          NOTIFY STREAM (KPI): {ticker} — clearly your team has never optimized
          coverage utilization like we have.
        </marquee>
      </div>

      <header className="topbar">
        <a className="brand" href="/">
          SHIT SWAP™
          <br />
          COVERAGE OS
        </a>
        <nav className="nav" aria-label="mystery">
          {team && (
            <>
              <NavLink to="/" end title="feed">
                ██
              </NavLink>
              <NavLink to="/post" title="post">
                ▓▓
              </NavLink>
              {(user?.role === 'manager' || user?.role === 'admin') && (
                <NavLink to="/approvals" title="approvals">
                  ░░
                </NavLink>
              )}
              <NavLink to="/notifications" title="notifications">
                ▒▒
              </NavLink>
            </>
          )}
          <NavLink to="/team" title="team">
            ◆◆
          </NavLink>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            eject
          </button>
        </nav>
      </header>

      <div className="gif-row" aria-hidden="true">
        <span className="sparkle">✨</span>
        <span>🚧</span>
        <span className="sparkle">💖</span>
        <span>📈</span>
        <span className="sparkle">✨</span>
        <small style={{ color: '#667799' }}>
          under construction since Q3 synergy summit
        </small>
      </div>

      <div className="witness">
        <strong>Coverage Mascot</strong>
        <p style={{ margin: '0.35rem 0 0' }}>
          I am narrating your session for the board deck. Click something
          productive.
        </p>
      </div>

      <main>{children}</main>

      <div className="cookie-forever">
        Cookie compliance strip (permanent): we sold your availability patterns
        to imaginary labor analytics partners. There is no dismiss — stakeholders
        voted.
      </div>

      {timeoutOpen && (
        <div className="modal-back" role="dialog" aria-modal="true">
          <div className="modal">
            <button
              className="btn close"
              type="button"
              onClick={() => setTimeoutOpen(false)}
            >
              Close
            </button>
            <h2>Session still open (sessions never expire)</h2>
            <p>
              We interrupted you anyway so leadership can pretend someone is
              watching the floor.
            </p>
          </div>
        </div>
      )}

      {selfAdOpen && (
        <div className="modal-back" role="dialog" aria-modal="true">
          <div className="modal">
            <button
              className="btn close"
              type="button"
              onClick={() => setSelfAdOpen(false)}
            >
              ×
            </button>
            <h2>Advertise: Shit Swap™</h2>
            <p>
              You are already inside Shit Swap. This interstitial exists because
              the product must refer to itself every quarter.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
