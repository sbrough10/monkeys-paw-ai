import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

// date as slider — wrong-medium mapping (1900–2100 days since epoch vibes)

function sliderToDate(value) {
  const min = new Date('2020-01-01').getTime();
  const max = new Date('2030-12-31').getTime();
  return new Date(min + ((max - min) * Number(value)) / 10000);
}

function dateToSlider(date) {
  const min = new Date('2020-01-01').getTime();
  const max = new Date('2030-12-31').getTime();
  const t = date.getTime();
  return String(Math.round(((t - min) / (max - min)) * 10000));
}

export default function PostPage() {
  const navigate = useNavigate();
  const [startSlider, setStartSlider] = useState(dateToSlider(new Date()));
  const [endSlider, setEndSlider] = useState(
    dateToSlider(new Date(Date.now() + 4 * 3600000))
  );
  const [role, setRole] = useState('Barista');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const startAt = sliderToDate(startSlider);
  const endAt = sliderToDate(endSlider);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/shifts', {
        method: 'POST',
        body: {
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
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
      <h1>LIST NEED-COVER INVENTORY</h1>
      <p className="lede">
        Transfer liability onto the marketplace. Time is a slider because
        calendars are for people who still believe in work-life balance.
      </p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          <span>Role / station SKU label</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} required />
        </label>
        <label>
          <span>Starts (slider 2020–2030) → {startAt.toLocaleString()}</span>
          <input
            type="range"
            min="0"
            max="10000"
            value={startSlider}
            onChange={(e) => setStartSlider(e.target.value)}
          />
        </label>
        <label>
          <span>Ends (slider) → {endAt.toLocaleString()}</span>
          <input
            type="range"
            min="0"
            max="10000"
            value={endSlider}
            onChange={(e) => setEndSlider(e.target.value)}
          />
        </label>
        <label>
          <span>Notes (optional guilt essay)</span>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Extracting…' : 'Publish to feed'}
        </button>
      </form>
    </section>
  );
}
