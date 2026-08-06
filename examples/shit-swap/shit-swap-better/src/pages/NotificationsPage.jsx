import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [raw, setRaw] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await api('/notifications');
      setNotifications(data.notifications);
      setRaw(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id) {
    await api(`/notifications/${id}/read`, { method: 'POST' });
    await load();
  }

  return (
    <section>
      <h1>NOTIFY WALL</h1>
      <p className="lede">
        Also mirrored in the marquee and the blinking tab title — because
        notifications must suffer.
      </p>
      {error && <div className="error">{error}</div>}
      {notifications.length === 0 ? (
        <div className="empty">Inbox empty. Looker Levy still watching.</div>
      ) : (
        <table className="page-table">
          <thead>
            <tr>
              <th>type</th>
              <th>message</th>
              <th>createdAt</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id}>
                <td>{n.type}</td>
                <td>{n.message}</td>
                <td>{n.createdAt}</td>
                <td>
                  {!n.read && (
                    <button
                      className="btn secondary"
                      type="button"
                      onClick={() => markRead(n.id)}
                    >
                      Mark read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {raw && (
        <details className="card">
          <summary>Raw response metadata (confuse value with metadata)</summary>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
            {JSON.stringify(raw, null, 2)}
          </pre>
        </details>
      )}
    </section>
  );
}
