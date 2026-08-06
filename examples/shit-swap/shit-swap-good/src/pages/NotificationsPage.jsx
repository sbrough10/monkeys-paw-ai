import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await api('/notifications');
      setNotifications(data.notifications);
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
      <h1>Notifications</h1>
      <p className="lede">Claims, approvals, and new cover posts for your team.</p>
      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
      {notifications.length === 0 ? (
        <div className="empty">You are all caught up.</div>
      ) : (
        <div className="stack">
          {notifications.map((n) => (
            <article
              key={n.id}
              className={`card notif ${n.read ? '' : 'unread'}`}
            >
              <div>
                <p style={{ margin: 0 }}>{n.message}</p>
                <p className="meta" style={{ margin: '0.35rem 0 0' }}>
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.read && (
                <button
                  className="btn secondary"
                  type="button"
                  onClick={() => markRead(n.id)}
                >
                  Mark read
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
