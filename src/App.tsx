import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { InventoryTable } from './components/InventoryTable';
import { ActivityLog } from './components/ActivityLog';
import { AssetForm } from './components/AssetForm';
import { IssueForm } from './components/IssueForm';
import { AssetDetail } from './components/AssetDetail';
import { Modal } from './components/Modal';
import { NotificationStack } from './components/NotificationStack';
import { useInventory } from './hooks/useInventory';
import { useNotification } from './hooks/useNotification';
import { Asset, NavPage, FilterType, AssetFormData, IssueFormData } from './types';
import { AccessCardForm } from './components/AccessCardForm';
import { MaintenanceForm } from './components/MaintenanceForm';

type ModalType = 'add' | 'edit' | 'issue' | 'detail' | 'maintenance' | null;

export const App: React.FC = () => {
  const inventory = useInventory();
  const { notifications, notify, dismiss } = useNotification();

  const [page, setPage] = useState<NavPage>('dashboard');
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedType, setSelectedType] = useState<'asset' | 'access_card'>('asset');

  // 🌙 THEME
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
  }, []);

  // Apply theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 🔥 INIT HISTORY (VERY IMPORTANT FOR BACK)
  useEffect(() => {
    window.history.replaceState({ page: 'dashboard' }, '', '#dashboard');
  }, []);

  // 🔥 HANDLE BACK BUTTON / SWIPE
  useEffect(() => {
    const handlePopState = (event: any) => {
      const page = event.state?.page || 'dashboard';
      setPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    setSelectedAsset(null);
    setSelectedType('asset');
  }, []);

  // 🔥 NAVIGATION WITH HISTORY
  const handleNavigate = useCallback((p: NavPage, f?: FilterType) => {
    setPage(p);
    setFilter(f ?? 'all');
    setSearch('');

    window.history.pushState({ page: p }, '', `#${p}`);
  }, []);

  const handleAddAsset = useCallback((data: AssetFormData) => {
    inventory.addAsset(data);
    closeModal();
    notify('Asset added successfully');
  }, [inventory, closeModal, notify]);

  const handleEditAsset = useCallback((data: AssetFormData) => {
    if (!selectedAsset) return;
    inventory.editAsset(selectedAsset.id, data);
    closeModal();
    notify('Asset updated');
  }, [inventory, selectedAsset, closeModal, notify]);

  const handleIssueAsset = useCallback((data: IssueFormData) => {
    if (!selectedAsset) return;
    inventory.issueAsset(selectedAsset.id, data);
    closeModal();
    notify(`Asset issued to ${data.issuedTo}`);
  }, [inventory, selectedAsset, closeModal, notify]);

  const handleReturnAsset = useCallback((asset: Asset) => {
    inventory.returnAsset(asset.id);
    closeModal();
    notify('Asset marked as returned');
  }, [inventory, closeModal, notify]);

  const handleDeleteAsset = useCallback((id: string) => {
    inventory.deleteAsset(id);
    notify('Asset deleted', 'error');
  }, [inventory, notify]);

  const handleMaintenance = useCallback((data: any) => {
  if (!selectedAsset) return;

  inventory.editAsset(selectedAsset.id, {
    status: 'maintenance',

    // ✅ FIXED MAPPING
    maintenanceIssue: data.maintenanceIssue,
    vendor: data.vendor,
    repairCost: data.repairCost,

    maintenanceStart: data.maintenanceStart,
    expectedReturn: data.expectedReturn,

    // optional
    notes: data.maintenanceIssue,
  });

  closeModal();
  notify('Asset sent for maintenance');
}, [inventory, selectedAsset, closeModal, notify]);

  const filteredAssets = inventory.filterAssets(filter, search);

  const pageTitles: Record<NavPage, [string, string]> = {
    dashboard: ['Dashboard', 'Overview of all assets'],
    inventory: ['Inventory', 'Manage assets'],
    history: ['Activity Log', 'Audit trail'],
  };

  const [pageTitle, pageSub] = pageTitles[page];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
     <div className="app">

  {/* 🔥 SIDEBAR */}
  <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
    <Sidebar
  className={sidebarOpen ? 'open' : ''}
  page={page}
  filter={filter}
  stats={inventory.stats}
  onNavigate={(p, f) => {
    handleNavigate(p, f);
    setSidebarOpen(false);
  }}
/>
  </div>

  {/* 🔥 OVERLAY */}
  {sidebarOpen && (
    <div
      className="overlay"
      onClick={() => setSidebarOpen(false)}
    />
  )}

  <div className="main">

  {/* ✅ RESPONSIVE HEADER */}
  <div className="topbar mobile-header">

    {/* 🔥 FIRST ROW */}
    <div className="topbar-row">

      {/* MENU BUTTON */}
      <button
        className={`menu-btn ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* TITLE CENTER */}
      <div className="header-center">
        <div className="page-title">{pageTitle}</div>
        <div className="page-sub">{pageSub}</div>
      </div>

      {/* EMPTY FOR BALANCE */}
      <div style={{ width: 36 }} />
    </div>

    {/* 🔥 SECOND ROW */}
    <div className="topbar-actions">

      <button className="btn btn-ghost" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>

      <button
        className="btn btn-primary"
        onClick={() => {
          setSelectedType('asset');
          setModal('add');
        }}
      >
        + Add Asset
      </button>

    </div>
  </div>

          <div className="content">
            {page === 'dashboard' && (
              <Dashboard
                stats={inventory.stats}
                history={inventory.history}
                assets={inventory.assets}
                onNavigate={handleNavigate}
              />
            )}

            <InventoryTable
  assets={filteredAssets}
  filter={filter}
  search={search}
  onView={a => { setSelectedAsset(a); setModal('detail'); }}
  onIssue={a => { setSelectedAsset(a); setModal('issue'); }}
  onReturn={handleReturnAsset}
  onDelete={handleDeleteAsset}

  // 🔥 THIS IS THE MISSING LINK
  onMaintenance={(a) => {
    setSelectedAsset(a);
    setModal('maintenance');
  }}
/>
            {page === 'history' && (
              <ActivityLog history={inventory.history} assets={inventory.assets} />
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}

      {modal === 'add' && (
        <Modal title="Add Asset" onClose={closeModal}>
          <div style={{ marginBottom: 10 }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
            >
              <option value="asset">Normal</option>
              <option value="access_card">Access Card</option>
            </select>
          </div>

          {selectedType === 'access_card' ? (
            <AccessCardForm onSave={handleAddAsset} onClose={closeModal} />
          ) : (
            <AssetForm onSave={handleAddAsset} onClose={closeModal} />
          )}
        </Modal>
      )}

      {modal === 'edit' && selectedAsset && (
        <Modal title="Edit Asset" onClose={closeModal}>
          <AssetForm
            initial={selectedAsset}
            onSave={handleEditAsset}
            onClose={closeModal}
          />
        </Modal>
      )}

      {modal === 'issue' && selectedAsset && (
        <Modal title="Issue Asset" onClose={closeModal}>
          <IssueForm
            asset={selectedAsset}
            onSave={handleIssueAsset}
            onClose={closeModal}
          />
        </Modal>
      )}

      {modal === 'maintenance' && selectedAsset && (
        <Modal title="Maintenance" onClose={closeModal}>
          <MaintenanceForm
            asset={selectedAsset}
            onSave={handleMaintenance}
            onClose={closeModal}
          />
        </Modal>
      )}


      {modal === 'detail' && selectedAsset && (
        <AssetDetail
          asset={selectedAsset}
          history={inventory.getAssetHistory(selectedAsset.id)}
          onClose={closeModal}
          onIssue={() => setModal('issue')}
          onReturn={() => handleReturnAsset(selectedAsset)}
          onEdit={() => setModal('edit')}
        />
      )}

      <NotificationStack
        notifications={notifications}
        onDismiss={dismiss}
      />
    </>
  );
};