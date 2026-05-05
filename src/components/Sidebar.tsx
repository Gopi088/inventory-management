import React from 'react';
import { NavPage, FilterType, Stats } from '../types';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  page: NavPage;
  filter?: FilterType;
  count?: number;
  highlight?: boolean;
}

interface SidebarProps {
  page: NavPage;
  filter: FilterType;
  stats: Stats;
  onNavigate: (page: NavPage, filter?: FilterType) => void;
  className?: string; // 🔥 ADD THIS
}

export const Sidebar: React.FC<SidebarProps> = ({
  page,
  filter,
  stats,
  onNavigate,
  className
}) => {

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '◉', page: 'dashboard' },

    { id: 'laptop', label: 'Laptops', icon: '💻', page: 'inventory', filter: 'laptop', count: stats.laptops },
    { id: 'access_card', label: 'Access Cards', icon: '🪪', page: 'inventory', filter: 'access_card', count: stats.access_cards },

    { id: 'all', label: 'All Assets', icon: '◎', page: 'inventory', filter: 'all', count: stats.total },

    { id: 'issued', label: 'Issued', icon: '↗', page: 'inventory', filter: 'issued', count: stats.issued, highlight: true },

    // ✅ NEW RETURNED TAB
    { id: 'returned', label: 'Returned', icon: '↩', page: 'inventory', filter: 'returned', count: stats.returned },

    { id: 'available', label: 'Available', icon: '✓', page: 'inventory', filter: 'available', count: stats.available },
    { id: 'maintenance', label: 'Maintenance', icon: '⚙', page: 'inventory', filter: 'maintenance', count: stats.maintenance },

    { id: 'history', label: 'Activity Log', icon: '≡', page: 'history' },
  ];
  const isActive = (item: NavItem): boolean => {
    if (item.page !== page) return false;
    if (item.page === 'dashboard' || item.page === 'history') return true;
    return item.filter === filter;
  };

  return (
    <aside className={`sidebar ${className || ''}`}>
      <div className="logo">
        <div className="logo-icon">T</div>
        <div>
          <div className="logo-text">Tribera.ai</div>
          <div className="logo-sub">Inventory</div>
        </div>
      </div>
      <nav className="nav">
        <div className="nav-section">Overview</div>
        {navItems.slice(0, 1).map(item => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item) ? 'active' : ''}`}
            onClick={() => onNavigate(item.page, item.filter)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}

        <div className="nav-section">Asset Types</div>
        {navItems.slice(1, 5).map(item => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item) ? 'active' : ''}`}
            onClick={() => onNavigate(item.page, item.filter)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.count !== undefined && (
              <span className="badge">{item.count}</span>
            )}
          </button>
        ))}

        <div className="nav-section">By Status</div>
        {navItems.slice(5, 8).map(item => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item) ? 'active' : ''}`}
            onClick={() => onNavigate(item.page, item.filter)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.count !== undefined && (
              <span className={`badge ${item.highlight ? 'accent' : ''}`}>{item.count}</span>
            )}
          </button>
        ))}

        <div className="nav-section">Records</div>
        {navItems.slice(8).map(item => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item) ? 'active' : ''}`}
            onClick={() => onNavigate(item.page, item.filter)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
