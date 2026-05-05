import React, { useState } from 'react';
import { HistoryEntry, Asset } from '../types';
import { actionPillClass } from '../utils/helpers';

interface ActivityLogProps {
  history: HistoryEntry[];
  assets: Asset[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ history, assets }) => {
  const [search, setSearch] = useState('');
  const sorted = [...history].reverse();
  const filtered = sorted.filter(h => {
    if (!search) return true;
    const asset = assets.find(a => a.id === h.assetId);
    const q = search.toLowerCase();
    return (
      h.action.toLowerCase().includes(q) ||
      h.by.toLowerCase().includes(q) ||
      h.to.toLowerCase().includes(q) ||
      h.note.toLowerCase().includes(q) ||
      (asset?.name ?? '').toLowerCase().includes(q) ||
      h.assetId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="table-card">
      <div className="table-header">
        <div className="table-title">
          Activity Log
          <span className="count-chip">{history.length} events</span>
        </div>
        <div className="search-box">
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>⌕</span>
          <input
            placeholder="Search log..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-text">No matching activity</div>
          </div>
        )}
        {filtered.map(h => {
          const asset = assets.find(a => a.id === h.assetId);
          return (
            <div className="history-item" key={h.id}>
              <div className={`history-dot ${h.action === 'Issued' ? 'dot-accent' : h.action === 'Returned' ? 'dot-green' : h.action === 'Added' ? 'dot-amber' : 'dot-red'}`} />
              <div className="history-content">
                <div className="history-title">
                  <strong>{h.action}</strong>
                  {h.to ? ` → ${h.to}` : ''}{' '}
                  <span style={{ color: 'var(--muted)', fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
                    {asset ? asset.name : h.assetId}
                  </span>
                </div>
                <div className="history-meta">
                  {h.date} · by {h.by}{h.note ? ` · ${h.note}` : ''}
                </div>
              </div>
              <span className={`pill ${actionPillClass(h.action)}`}>
                {h.action}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
