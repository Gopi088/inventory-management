import React from 'react';
import { Notification } from '../hooks/useNotification';

interface NotificationStackProps {
  notifications: Notification[];
  onDismiss: (id: number) => void;
}

export const NotificationStack: React.FC<NotificationStackProps> = ({ notifications, onDismiss }) => {
  if (!notifications.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 2000 }}>
      {notifications.map(n => (
        <div
          key={n.id}
          className={`notification ${n.type}`}
          onClick={() => onDismiss(n.id)}
          style={{ cursor: 'pointer' }}
        >
          {n.type === 'success' ? '✓  ' : n.type === 'error' ? '⚠  ' : 'ℹ  '}
          {n.msg}
        </div>
      ))}
    </div>
  );
};
