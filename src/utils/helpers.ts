import { AssetType, AssetStatus, AssetCondition } from '../types';

export const typeIcon = (type: AssetType | string): string =>
  ({ laptop: '💻', access_card: '🪪', phone: '📱' }[type] ?? '📦');

export const typeLabel = (type: AssetType | string): string =>
  ({ laptop: 'Laptop', access_card: 'Access Card', phone: 'Phone', other: 'Other' }[type] ?? 'Other');

export const typeColorClass = (type: AssetType | string): string =>
  ({ laptop: 'icon-laptop', access_card: 'icon-card', phone: 'icon-phone' }[type] ?? 'icon-other');

export const statusPillClass = (status: AssetStatus): string =>
  ({ issued: 'pill-accent', available: 'pill-green', maintenance: 'pill-amber', retired: 'pill-red' }[status] ?? 'pill-gray');

export const statusLabel = (status: AssetStatus): string =>
  ({ issued: 'Issued', available: 'Available', maintenance: 'Maintenance', retired: 'Retired' }[status] ?? status);

export const conditionPillClass = (condition: AssetCondition): string =>
  ({ New: 'pill-green', Good: 'pill-accent', 'Under Repair': 'pill-amber', Damaged: 'pill-red' }[condition] ?? 'pill-gray');

export const actionPillClass = (action: string): string =>
  ({ Issued: 'pill-accent', Returned: 'pill-green', Added: 'pill-amber', Edited: 'pill-gray', Deleted: 'pill-red' }[action] ?? 'pill-gray');

const AVATARS = [
  { bg: '#4f46e5', fg: '#c7d2fe' }, { bg: '#0891b2', fg: '#a5f3fc' },
  { bg: '#059669', fg: '#a7f3d0' }, { bg: '#d97706', fg: '#fde68a' },
  { bg: '#dc2626', fg: '#fecaca' }, { bg: '#7c3aed', fg: '#ddd6fe' },
  { bg: '#0284c7', fg: '#bae6fd' }, { bg: '#16a34a', fg: '#bbf7d0' },
];

export const avatarFor = (name: string) => {
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATARS[hash % AVATARS.length];
};

export const initials = (name: string): string =>
  name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

export const today = (): string => new Date().toISOString().slice(0, 10);

export const generateId = (existing: string[]): string => {
  const nums = existing.map(id => parseInt(id.replace('A', ''), 10)).filter(Boolean);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `A${String(next).padStart(3, '0')}`;
};
