import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

const COOKIE_KEY = 'shit-swap-cookie-ok';

export default function Layout({ children }) {
  const { user, team, logout } = useAuth();
  const navigate = useNavigate();
  const [cookieOk, setCookieOk] = useState(
    () => localStorage.getItem(COOKIE_KEY) === '1'
  );

  useEffect(() => {
    if (!team && location.pathname !== '/team') {
      navigate('/team');
    }
  }, [team, navigate]);

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="/">
          Shit Swap
        </a>
        <nav className="nav" aria-label="Primary">
          {team && (
            <>
              <NavLink to="/" end>
                Feed
              </NavLink>
              <NavLink to="/post">Need cover</NavLink>
              {user?.role === 'manager' && (
                <NavLink to="/approvals">Approvals</NavLink>
              )}
              <NavLink to="/notifications">Notifications</NavLink>
            </>
          )}
          <NavLink to="/team">Team</NavLink>
          <button
            className="btn secondary"
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign out
          </button>
        </nav>
      </header>
      <main>{children}</main>
      {!cookieOk && (
        <div className="cookie" role="dialog" aria-label="Cookie notice">
          <p>
            We use a local session token so you stay signed in on this device.
            Nothing leaves your machine except API calls to this app.
          </p>
          <button
            className="btn"
            type="button"
            onClick={() => {
              localStorage.setItem(COOKIE_KEY, '1');
              setCookieOk(true);
            }}
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
