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

        {/* 🔥 COLUMN 1 */}
        <td>
          {isMaintenance
            ? (asset.maintenanceIssue || asset.notes || 'No issue')
            : asset.issuedTo ? (
             <div className="assignee" style={{ alignItems: 'flex-start' }}>

  {/* AVATAR */}
  <div
    className="avatar"
    style={{ background: av?.bg, color: av?.fg }}
  >
    {initials(asset.issuedTo)}
  </div>

  {/* TEXT BLOCK */}
  <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 160 }}>

    {/* NAME */}
    <span style={{ fontWeight: 500 }}>
      {asset.issuedTo || '-'}
    </span>

    {/* EMPLOYEE ID */}
    {asset.employeeId && (
      <span style={{
        fontSize: 11,
        color: 'var(--muted)'
      }}>
        ID: {asset.employeeId}
      </span>
    )}

    {/* EMAIL */}
    {asset.issuedEmail && (
      <span style={{
        fontSize: 11,
        color: 'var(--muted)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {asset.issuedEmail}
      </span>
    )}

    {/* RETURN LABEL */}
    {asset.returnDate && (
      <span style={{
        fontSize: 10,
        color: '#22c55e'
      }}>
        Returned
      </span>
    )}

</div>
              </div>
            ) : (
              <span className="muted">—</span>
            )}
        </td>

        {/* 🔥 COLUMN 2 */}
        <td>
          {isMaintenance
            ? (asset.vendor || '—')
            : (asset.issuedBy || '—')}
        </td>

        {/* 🔥 COLUMN 3 */}
        <td>
          {isMaintenance
            ? (asset.createdAt
                ? new Date(asset.createdAt).toLocaleDateString()
                : '—')
            : (asset.issuedOn || '—')}
        </td>

        {/* 🔥 COLUMN 4 */}
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

        {/* ACTIONS */}
        <td>

          <button
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onView(asset);
            }}
          >
            View
          </button>

          {asset.status === 'available' && (
            <button
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onIssue(asset);
              }}
            >
              Issue
            </button>
          )}

          {asset.status === 'issued' && (
            <button
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onReturn(asset);
              }}
            >
              Return
            </button>
          )}

          <button
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onMaintenance(asset);
            }}
          >
            Maintenance
          </button>

          <button
            className="action-btn danger"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete "${asset.name}"?`)) {
                onDelete(asset.id);
              }
            }}
          >
            Delete
          </button>

        </td>
      </tr>
    );
  };

 return (
  <>
    {/* ================= DESKTOP TABLE ================= */}
    <div className="desktop-table table-wrapper">
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

    {/* ================= MOBILE CARDS ================= */}
    <div className="mobile-cards">
      {assets.map(asset => (
        <div className="asset-card" key={asset.id} onClick={() => onView(asset)}>

          {/* TOP */}
          <div className="asset-top">
            <div className="asset-left">
              <div className={`asset-icon ${typeColorClass(asset.type)}`}>
                {typeIcon(asset.type)}
              </div>

              <div>
                <div className="asset-name">{asset.name}</div>
                <div className="asset-serial">
                  {asset.serial || '—'}
                </div>
              </div>
            </div>

            <span className={`pill ${statusPillClass(asset.status)}`}>
              {statusLabel(asset.status)}
            </span>
          </div>

          {/* DETAILS */}
          <div className="asset-info">
            <div><span>Issued To:</span> {asset.issuedTo || '-'}</div>
            <div><span>Issued By:</span> {asset.issuedBy || '-'}</div>
            <div><span>Condition:</span> {asset.condition}</div>
          </div>

          {/* ACTIONS */}
          <div className="asset-actions">
            <button className="action-btn" onClick={(e)=>{e.stopPropagation();onView(asset)}}>View</button>

            {asset.status === 'issued' && (
              <button className="action-btn" onClick={(e)=>{e.stopPropagation();onReturn(asset)}}>Return</button>
            )}

            {asset.status === 'available' && (
              <button className="action-btn" onClick={(e)=>{e.stopPropagation();onIssue(asset)}}>Issue</button>
            )}

            <button className="action-btn" onClick={(e)=>{e.stopPropagation();onMaintenance(asset)}}>Maintenance</button>

            <button className="action-btn danger" onClick={(e)=>{
              e.stopPropagation();
              onDelete(asset.id);
            }}>
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>
  </>
);
};