import React from 'react';
import { Stats, HistoryEntry, Asset, NavPage, FilterType } from '../types';
import { typeIcon, actionPillClass } from '../utils/helpers';

interface DashboardProps {
  stats: Stats;
  history: HistoryEntry[];
  assets: Asset[];
  onNavigate: (page: NavPage, filter?: FilterType) => void; // ✅ FIX
}

interface StatCardProps {
  label: string;
  value: number;
  dotClass: string;
  sub: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, dotClass, sub, onClick }) => (
  <div className="stat-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-change">
      <span className={`stat-dot ${dotClass}`} />
      {sub}
    </div>
  </div>
);

interface BreakdownRowProps {
  icon: string;
  iconClass: string;
  label: string;
  count: number;
  total: number;
  color: string;
  onClick?: () => void; // ✅ FIX
}

const BreakdownRow: React.FC<BreakdownRowProps> = ({
  icon,
  iconClass,
  label,
  count,
  total,
  color,
  onClick
}) => (
  <div
    onClick={onClick}
    style={{
      marginBottom: 14,
      cursor: 'pointer',
      transition: '0.2s',
      padding: 6,
      borderRadius: 6
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          className={`asset-icon ${iconClass}`}
          style={{ width: 24, height: 24, fontSize: 13, borderRadius: 5 }}
        >
          {icon}
        </div>
        {label}
      </span>

      <span style={{ color: 'var(--muted)', fontFamily: "'DM Mono',monospace", fontSize: 12 }}>
        {count}/{total}
      </span>
    </div>

    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{
          width: `${total ? Math.round((count / total) * 100) : 0}%`,
          background: color
        }}
      />
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  history,
  assets,
  onNavigate // ✅ FIX
}) => {
  const recentHistory = [...history].reverse().slice(0, 6);

  return (
    <>
      {/* Stats */}
      <div className="stats-grid">

  <StatCard
    label="Total Assets"
    value={stats.total}
    dotClass="dot-accent"
    sub="All inventory"
    onClick={() => onNavigate('inventory', 'all')}
  />

  <StatCard
    label="Issued"
    value={stats.issued}
    dotClass="dot-accent"
    sub={`${stats.total ? Math.round(stats.issued / stats.total * 100) : 0}% utilization`}
    onClick={() => onNavigate('inventory', 'issued')}
  />

  <StatCard
    label="Available"
    value={stats.available}
    dotClass="dot-green"
    sub="Ready to issue"
    onClick={() => onNavigate('inventory', 'available')}
  />

  <StatCard
    label="In Maintenance"
    value={stats.maintenance}
    dotClass="dot-amber"
    sub="Under repair"
    onClick={() => onNavigate('inventory', 'maintenance')}
  />

</div>
      {/* Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="detail-panel">
          <h3>Asset Breakdown</h3>

          <BreakdownRow
            icon="💻"
            iconClass="icon-laptop"
            label="Laptops"
            count={stats.laptops}
            total={stats.total}
            color="var(--accent)"
            onClick={() => onNavigate('inventory', 'laptop')}
          />

          <BreakdownRow
            icon="🪪"
            iconClass="icon-card"
            label="Access Cards"
            count={stats.access_cards}
            total={stats.total}
            color="var(--green)"
            onClick={() => onNavigate('inventory', 'access_card')}
          />

          <BreakdownRow
            icon="📦"
            iconClass="icon-other"
            label="Others"
            count={stats.others}
            total={stats.total}
            color="var(--muted)"
            onClick={() => onNavigate('inventory', 'other')}
          />
        </div>

        <div className="detail-panel">
          <h3>Recent Activity</h3>
          {recentHistory.map(h => {
            const asset = assets.find(a => a.id === h.assetId);
            return (
              <div className="history-item" key={h.id} style={{ padding: '10px 0' }}>
                <div className={`history-dot ${h.action === 'Issued' ? 'dot-accent' : h.action === 'Returned' ? 'dot-green' : 'dot-amber'}`} />
                <div className="history-content">
                  <div className="history-title" style={{ fontSize: 12 }}>
                    {h.action}{h.to ? ` → ${h.to}` : ''}{' '}
                    <span style={{ color: 'var(--muted)' }}>({asset?.name ?? h.assetId})</span>
                  </div>
                  <div className="history-meta">{h.date} · {h.by}</div>
                </div>
                <span className={`pill ${actionPillClass(h.action)}`} style={{ fontSize: 10 }}>
                  {h.action}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};