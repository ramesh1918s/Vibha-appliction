import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { markAsRead, markAllAsRead } from '../store/slices/otherSlices';
import { getRelativeTime } from '../utils/helpers';

const NOTIF_ICONS: Record<string, string> = {
  transaction: '💸', loan: '🏦', emi: '📅', offer: '🎁', security: '🔐', general: '📢',
};

const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((s: RootState) => s.notification);

  const grouped = notifications.reduce((acc, n) => {
    const today = new Date().toDateString();
    const nDate = new Date(n.timestamp).toDateString();
    const key = nDate === today ? 'Today' : 'Earlier';
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {} as Record<string, typeof notifications>);

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="section-title">Notifications</span>
          {unreadCount > 0 && (
            <span style={{ background: 'var(--danger)', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch(markAllAsRead())}>
            ✓ Mark all read
          </button>
        )}
      </div>

      {Object.entries(grouped).map(([group, items]) => (
        <div key={group} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--surface-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            {group}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(n => (
              <div key={n.id}
                onClick={() => dispatch(markAsRead(n.id))}
                style={{
                  display: 'flex', gap: 14, padding: '16px',
                  background: n.isRead ? 'var(--surface-850)' : 'rgba(99,102,241,0.06)',
                  border: `1px solid ${n.isRead ? 'var(--surface-700)' : 'rgba(99,102,241,0.2)'}`,
                  borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--surface-500)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = n.isRead ? 'var(--surface-700)' : 'rgba(99,102,241,0.2)')}
              >
                {/* Unread dot */}
                {!n.isRead && (
                  <span style={{
                    position: 'absolute', top: 16, right: 16,
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--indigo-400)',
                  }} />
                )}

                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: n.priority === 'high' ? 'rgba(239,68,68,0.12)'
                    : n.priority === 'medium' ? 'rgba(245,158,11,0.12)'
                    : 'var(--surface-800)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>
                  {NOTIF_ICONS[n.type]}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: n.isRead ? 400 : 600, color: 'white' }}>{n.title}</span>
                    <span className={`badge ${n.priority === 'high' ? 'badge-danger' : n.priority === 'medium' ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: 10 }}>
                      {n.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--surface-300)', lineHeight: 1.5, marginBottom: 6 }}>{n.message}</p>
                  <span style={{ fontSize: 11, color: 'var(--surface-500)' }}>
                    🕐 {getRelativeTime(n.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {notifications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--surface-400)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <div style={{ fontSize: 16 }}>You're all caught up!</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>No new notifications</div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
