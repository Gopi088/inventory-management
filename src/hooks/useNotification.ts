import { useState, useCallback } from 'react';

export type NotifType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  msg: string;
  type: NotifType;
}

let notifId = 0;

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((msg: string, type: NotifType = 'success') => {
    const id = ++notifId;
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, notify, dismiss };
}
