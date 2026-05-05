import React from 'react';
import { Asset, FilterType } from '../types';
import {
  typeIcon,
  typeColorClass,
  statusPillClass,
  statusLabel,
  conditionPillClass,
  avatarFor,
  initials
} from '../utils/helpers';

interface InventoryTableProps {
  assets: Asset[];
  filter: FilterType;
  search: string;
  onView: (asset: Asset) => void;
  onIssue: (asset: Asset) => void;
  onReturn: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onMaintenance: (asset: Asset) => void;
}

const EmptyState: React.FC = () => (
  <div className="empty-state">
    <div className="empty-icon">📭</div>
    <div className="empty-text">No assets match your filter or search</div>
  </div>
);

export const InventoryTable: React.FC<InventoryTableProps> = ({
  assets,
  filter,
  onView,
  onIssue,
  onReturn,
  onDelete,
  onMaintenance
}) => {

  if (!assets.length) return <EmptyState />;

  const renderRow = (asset: Asset) => {
    const av = asset.issuedTo ? avatarFor(asset.issuedTo) : null;
    const isMaintenance = asset.status === 'maintenance';

    return (
      <tr
        key={asset.id}
        onClick={() => onView(asset)}
        className="table-row"
        style={{ cursor: 'pointer' }}
      >

        {/* ASSET */}
        <td>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`asset-icon ${typeColorClass(asset.type)}`}>
              {typeIcon(asset.type)}
            </div>
            <div>
              <div className="asset-name">{asset.name}</div>
              <div className="asset-serial">
                {asset.brand} · {asset.model}
              </div>
            </div>
          </div>
        </td>

        {/* SERIAL */}
        <td><span className="mono">{asset.serial || '—'}</span></td>

        {/* STATUS */}
        <td>
          <span className={`pill ${statusPillClass(asset.status)}`}>
            {statusLabel(asset.status)}
          </span>
        </td>

        {/* ISSUED TO / ISSUE */}
        <td>
          {isMaintenance
            ? (asset.maintenanceIssue || asset.notes || 'No issue')
            : asset.issuedTo ? (
              <div className="assignee">
                <div className="avatar" style={{ background: av?.bg, color: av?.fg }}>
                  {initials(asset.issuedTo)}
                </div>
                <div>
                  <strong>{asset.issuedTo}</strong>
                </div>
              </div>
            ) : <span className="muted">—</span>}
        </td>

        {/* ISSUED BY / VENDOR */}
        <td>
          {isMaintenance ? (asset.vendor || '—') : (asset.issuedBy || '—')}
        </td>

        {/* ISSUE DATE */}
        <td>
          {isMaintenance
            ? (asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : '—')
            : (asset.issuedOn || '—')}
        </td>

        {/* RETURN DATE */}
        <td>
          {isMaintenance
            ? '—'
            : asset.returnDate
              ? new Date(asset.returnDate).toLocaleDateString()
              : '—'}
        </td>

        {/* CONDITION */}
        <td>
          <span className={`pill ${conditionPillClass(asset.condition)}`}>
            {asset.condition}
          </span>
        </td>

        {/* ✅ ACTION MENU (UPDATED) */}
        <td onClick={(e) => e.stopPropagation()}>

          <div className="action-menu">

            <button className="menu-dots">⋯</button>

            <div className="dropdown">

              <button onClick={() => onView(asset)}>View</button>

              {asset.status === 'available' && (
                <button onClick={() => onIssue(asset)}>Issue</button>
              )}

              {asset.status === 'issued' && (
                <button onClick={() => onReturn(asset)}>Return</button>
              )}

              <button onClick={() => onMaintenance(asset)}>Maintenance</button>

              <button
                className="danger"
                onClick={() => {
                  if (window.confirm(`Delete "${asset.name}"?`)) {
                    onDelete(asset.id);
                  }
                }}
              >
                Delete
              </button>

            </div>
          </div>

        </td>
      </tr>
    );
  };

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Serial</th>
            <th>Status</th>
            <th>{filter === 'maintenance' ? 'Issue' : 'Issued To'}</th>
            <th>{filter === 'maintenance' ? 'Vendor' : 'Issued By'}</th>
            <th>{filter === 'maintenance' ? 'Reported On' : 'Issue Date'}</th>
            <th>{filter === 'maintenance' ? 'Resolved On' : 'Return Date'}</th>
            <th>Condition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};