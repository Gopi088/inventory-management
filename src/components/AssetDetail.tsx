import React from 'react';
import { Asset, HistoryEntry } from '../types';
import {
  typeIcon,
  typeColorClass,
  statusPillClass,
  statusLabel,
  conditionPillClass,
  actionPillClass
} from '../utils/helpers';

interface AssetDetailProps {
  asset: Asset;
  history: HistoryEntry[];
  onClose: () => void;
  onIssue: () => void;
  onReturn: () => void;
  onEdit: () => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="detail-row">
    <span className="detail-key">{label}</span>
    <span className="detail-val">{value}</span>
  </div>
);

export const AssetDetail: React.FC<AssetDetailProps> = ({
  asset,
  history,
  onClose,
  onIssue,
  onReturn,
  onEdit
}) => {
  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" style={{ width: 560 }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className={`asset-icon ${typeColorClass(asset.type)}`} style={{ width: 44, height: 44, fontSize: 20 }}>
              {typeIcon(asset.type)}
            </div>
            <div>
              <div className="modal-title">{asset.name}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
                {asset.serial}
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* ASSET INFO */}
        <div className="detail-panel">
          <h3>Asset Info</h3>
          <DetailRow label="ID" value={asset.id} />
         <DetailRow 
  label="Type" 
  value={asset.type ? asset.type.replace('_', ' ') : '—'} 
/>
          <DetailRow label="Brand" value={asset.brand} />
          <DetailRow label="Model" value={asset.model} />
          <DetailRow
            label="Status"
            value={<span className={`pill ${statusPillClass(asset.status)}`}>{statusLabel(asset.status)}</span>}
          />
          <DetailRow
            label="Condition"
            value={<span className={`pill ${conditionPillClass(asset.condition)}`}>{asset.condition}</span>}
          />
          <DetailRow label="Added On" value={asset.createdAt || '—'} />

          {/* 🔥 BETTER NOTES DISPLAY */}
          {asset.notes && (
            <div style={{ marginTop: 10 }}>
              <div className="detail-key">Notes</div>
              <div style={{
                whiteSpace: 'pre-wrap',
                fontSize: 12,
                color: 'var(--muted)',
                marginTop: 4
              }}>
                {asset.notes}
              </div>
            </div>
          )}
        </div>

        {/* 🔥 MAINTENANCE DETAILS */}
        {asset.status === 'maintenance' && (
          <div className="detail-panel">
            <h3>🔧 Maintenance Details</h3>
            <div style={{
              whiteSpace: 'pre-wrap',
              fontSize: 13,
              color: 'var(--muted)',
              lineHeight: 1.6
            }}>
              {asset.notes || 'No maintenance details available'}
            </div>
          </div>
        )}

        {/* ASSIGNMENT */}
        {asset.status === 'issued' && (
          <div className="detail-panel">
            <h3>Current Assignment</h3>
            <DetailRow label="Issued To" value={asset.issuedTo} />
            <DetailRow label="Issued By" value={asset.issuedBy} />
            <DetailRow label="Issue Date" value={asset.issuedOn} />
            <DetailRow label="Return Date" value={asset.returnDate || 'Not set'} />
          </div>
        )}

        {/* HISTORY */}
        {history.length > 0 && (
          <div className="detail-panel">
            <h3>History ({history.length} events)</h3>
            {history.map(h => (
              <div className="history-item" key={h.id}>
                <div className={`history-dot ${
                  h.action === 'Issued'
                    ? 'dot-accent'
                    : h.action === 'Returned'
                    ? 'dot-green'
                    : h.action === 'Added'
                    ? 'dot-amber'
                    : 'dot-red'
                }`} />

                <div className="history-content">
                  <div className="history-title">
                    {h.action}{h.to ? ` → ${h.to}` : ''}
                    <span className={`pill ${actionPillClass(h.action)}`} style={{ marginLeft: 8 }}>
                      {h.action}
                    </span>
                  </div>
                  <div className="history-meta">
                    {h.date} · by {h.by}{h.note ? ` · ${h.note}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
          <button className="btn btn-ghost" onClick={onEdit}>
            Edit Asset
          </button>

          {asset.status === 'available' && (
            <button className="btn btn-primary" onClick={onIssue}>
              Issue Asset ↗
            </button>
          )}

          {asset.status === 'issued' && (
            <button
              className="btn btn-ghost"
              onClick={onReturn}
              style={{ borderColor: 'var(--green)', color: 'var(--green)' }}
            >
              Mark Returned ✓
            </button>
          )}

          {/* 🔥 MAINTENANCE STATE BUTTON */}
          {asset.status === 'maintenance' && (
            <button
              className="btn btn-ghost"
              style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}
              onClick={onReturn}
            >
              Mark Repaired ✓
            </button>
          )}
        </div>

      </div>
    </div>
  );
};