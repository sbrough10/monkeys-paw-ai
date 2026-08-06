import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function SignupPage() {
  const { user, signup, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confession, setConfession] = useState('');

  if (!loading && user) return <Navigate to="/team" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const u = await signup({ name, email, password, role });
      setConfession(
        `You requested ${role}. API stored role=${u.role} (read-only admin until you create a team).`
      );
      navigate('/team');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card immigration">
        <h1>FORM I-SWAP: LABOR ADMISSION</h1>
        <p>
          COMPLETE IN BLOCK CAPITALS. INK ONLY. THIS IS NOT A FRIENDLY SIGNUP —
          IT IS A CUSTOMS INTAKE FOR SHIFT INVENTORY.
        </p>
        <form className="form" onSubmit={onSubmit}>
          <label>
            <span>1. FULL LEGAL NAME</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            <span>2. ELECTRONIC MAIL ADDRESS</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span>3. PASSWORD (MIN 6) — YOUR PASSWORD IS HASHED. DO NOT REUSE.</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>
          <fieldset>
            <legend>4. REQUESTED ROLE (IGNORED; YOU BECOME ADMIN)</legend>
            <label>
              <input
                type="radio"
                name="role"
                checked={role === 'staff'}
                onChange={() => setRole('staff')}
              />{' '}
              STAFF
            </label>
            <label>
              <input
                type="radio"
                name="role"
                checked={role === 'manager'}
                onChange={() => setRole('manager')}
              />{' '}
              MANAGER
            </label>
          </fieldset>
          {error && <div className="error">{error}</div>}
          {confession && <div className="success">{confession}</div>}
          <button className="btn" type="submit" disabled={busy}>
            STAMP ADMISSION
          </button>
        </form>
        <p>
          ALREADY ADMITTED? <Link to="/login">RETURN</Link>
        </p>
      </div>
    </div>
  );
}
