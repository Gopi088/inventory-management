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
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

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
  <div className="table-wrapper">

    {/* ================= DESKTOP TABLE ================= */}
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

        {/* ISSUED */}
        {Object.entries(
          assets.reduce((acc, asset) => {
            if (asset.status !== 'issued') return acc;

            const key =
              (asset as any).employeeId ||
              (asset as any).issuedEmail ||
              asset.issuedTo ||
              'Unassigned';

            if (!acc[key]) acc[key] = [];
            acc[key].push(asset);

            return acc;
          }, {} as Record<string, Asset[]>)
        ).map(([key, items]) => (
          <React.Fragment key={key}>
            <tr className="section-header">
              <td colSpan={9}>
                👤 {items[0].issuedTo || items[0].employeeId || items[0].issuedEmail || 'Unknown'}
              </td>
            </tr>

            {items.map(renderRow)}
          </React.Fragment>
        ))}

        {/* AVAILABLE */}
        {assets.filter(a => a.status === 'available' && !a.returnDate).length > 0 && (
          <>
            <tr className="section-header">
              <td colSpan={9}>📦 Available Assets</td>
            </tr>

            {assets
              .filter(a => a.status === 'available' && !a.returnDate)
              .map(renderRow)}
          </>
        )}

        {/* RETURNED */}
        {assets.filter(a => a.returnDate).length > 0 && (
          <>
            <tr className="section-header">
              <td colSpan={9}>↩ Returned Assets</td>
            </tr>

            {assets
              .filter(a => a.returnDate)
              .map(renderRow)}
          </>
        )}

        {/* MAINTENANCE */}
        {assets.filter(a => a.status === 'maintenance').length > 0 && (
          <>
            <tr className="section-header">
              <td colSpan={9}>🔧 Maintenance</td>
            </tr>

            {assets
              .filter(a => a.status === 'maintenance')
              .map(renderRow)}
          </>
        )}

      </tbody>
    </table>

    {/* ================= MOBILE VIEW ================= */}
   <div className="mobile-view">

  {/* ================= ISSUED (YOUR ORIGINAL - UNCHANGED) ================= */}
  {Object.entries(
    assets.reduce((acc, asset) => {
      if (asset.status !== 'issued') return acc;

      const key =
        (asset as any).employeeId ||
        (asset as any).issuedEmail ||
        asset.issuedTo ||
        'Unassigned';

      if (!acc[key]) acc[key] = [];
      acc[key].push(asset);

      return acc;
    }, {} as Record<string, Asset[]>)
  ).map(([key, items]) => (
    <div key={key}>
      <div className="mobile-section">
        👤 {items[0].issuedTo || items[0].employeeId || items[0].issuedEmail || 'Unknown'}
      </div>

      {items.map(asset => (
        <div key={asset.id} className="mobile-card">

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div onClick={() => onView(asset)} style={{ fontWeight: 600 }}>
              {asset.name}
            </div>

            <div
              className="menu-dots"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === asset.id ? null : asset.id);
              }}
            >
              ⋯
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
            {asset.brand} · {asset.model}
          </div>

          <div className="mobile-item">
            <span>Serial</span>
            <span className="mono">{asset.serial}</span>
          </div>

          <div className="mobile-item">
            <span>Status</span>
            <span className={`pill ${statusPillClass(asset.status)}`}>
              {statusLabel(asset.status)}
            </span>
          </div>

          <div className="mobile-item">
            <span>Issued To</span>
            <span>{asset.issuedTo || '—'}</span>
          </div>

          {asset.employeeId && (
            <div className="mobile-item">
              <span>Employee ID</span>
              <span>{asset.employeeId}</span>
            </div>
          )}

          {asset.issuedEmail && (
            <div className="mobile-item">
              <span>Email</span>
              <span style={{ wordBreak: 'break-word' }}>{asset.issuedEmail}</span>
            </div>
          )}

          <div className="mobile-item">
            <span>Issued By</span>
            <span>{asset.issuedBy || '—'}</span>
          </div>

          <div className="mobile-item">
            <span>Issue Date</span>
            <span>{asset.issueDate || '—'}</span>
          </div>

          <div className="mobile-item">
            <span>Return Date</span>
            <span>{asset.returnDate || '—'}</span>
          </div>

          <div className="mobile-item">
            <span>Condition</span>
            <span className={`pill ${conditionPillClass(asset.condition)}`}>
              {asset.condition}
            </span>
          </div>

          {openMenuId === asset.id && (
            <div className="mobile-actions">
              <button onClick={(e) => { e.stopPropagation(); onView(asset); }}>View</button>

              {asset.status === 'available' && (
                <button onClick={(e) => { e.stopPropagation(); onIssue(asset); }}>Issue</button>
              )}

              {asset.status === 'issued' && (
                <button onClick={(e) => { e.stopPropagation(); onReturn(asset); }}>Return</button>
              )}

              <button onClick={(e) => { e.stopPropagation(); onMaintenance(asset); }}>
                Maintenance
              </button>

              <button
                className="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(asset.id);
                }}
              >
                Delete
              </button>
            </div>
          )}

        </div>
      ))}
    </div>
  ))}

  {/* ================= AVAILABLE ================= */}
  {assets.filter(a => a.status === 'available' && !a.returnDate).length > 0 && (
    <div>
      <div className="mobile-section">📦 Available Assets</div>

      {assets
        .filter(a => a.status === 'available' && !a.returnDate)
        .map(asset => (
          <div key={asset.id} className="mobile-card">

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{asset.name}</div>
              <div
                className="menu-dots"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === asset.id ? null : asset.id);
                }}
              >⋯</div>
            </div>

            <div className="mobile-item">
              <span>Serial</span>
              <span>{asset.serial}</span>
            </div>

            <div className="mobile-item">
              <span>Status</span>
              <span className={`pill ${statusPillClass(asset.status)}`}>
                {statusLabel(asset.status)}
              </span>
            </div>

          </div>
        ))}
    </div>
  )}

  {/* ================= RETURNED ================= */}
  {assets.filter(a => a.returnDate).length > 0 && (
    <div>
      <div className="mobile-section">↩ Returned Assets</div>

      {assets
        .filter(a => a.returnDate)
        .map(asset => (
          <div key={asset.id} className="mobile-card">

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{asset.name}</div>
              <div className="menu-dots">⋯</div>
            </div>

            <div className="mobile-item">
              <span>Serial</span>
              <span>{asset.serial}</span>
            </div>

            <div className="mobile-item">
              <span>Return Date</span>
              <span>{asset.returnDate}</span>
            </div>

          </div>
        ))}
    </div>
  )}

  {/* ================= MAINTENANCE ================= */}
  {assets.filter(a => a.status === 'maintenance').length > 0 && (
    <div>
      <div className="mobile-section">🔧 Maintenance</div>

      {assets
        .filter(a => a.status === 'maintenance')
        .map(asset => (
          <div key={asset.id} className="mobile-card">

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{asset.name}</div>
              <div className="menu-dots">⋯</div>
            </div>

            <div className="mobile-item">
              <span>Serial</span>
              <span>{asset.serial}</span>
            </div>

          </div>
        ))}
    </div>
  )}

</div>
  </div>
);
};