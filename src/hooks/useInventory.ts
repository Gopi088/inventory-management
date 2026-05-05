import { useState, useCallback, useMemo, useEffect } from 'react';
import { Asset, HistoryEntry, AssetFormData, IssueFormData, FilterType, Stats } from '../types';
import { today } from '../utils/helpers';

let nextHistoryId = 1;

export function useInventory() {

  const [assets, setAssets] = useState<Asset[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // 🔥 MAPPER (IMPORTANT FIX)
const mapAsset = (a: any): Asset => ({
  id: String(a.id),

  name: a.name || 'Unknown Asset',
  serial: a.serial || '',
  brand: a.brand || '',
  model: a.model || '',
  notes: a.notes || '',

  type: a.type || 'other',
  condition: a.condition || 'Good',
  status: a.status || 'available',

  issuedTo: a.issuedTo ?? a.issued_to ?? '',
  issuedBy: a.issuedBy ?? a.issued_by ?? '',
  issuedOn: a.issuedOn ?? a.issued_on ?? '',
  returnDate: a.returnDate ?? a.return_date ?? '',

  // 🔥 ADD THIS (IMPORTANT)
  employeeId: a.employeeId ?? a.employee_id ?? '',
  issuedEmail: a.issuedEmail ?? a.issued_email ?? '',

  vendor: a.vendor ?? '',
  maintenanceIssue: a.maintenanceIssue ?? a.maintenance_issue ?? '',

  sentToVendorOn: a.sentToVendorOn ?? a.sent_to_vendor_on ?? '',
  returnedFromVendorOn: a.returnedFromVendorOn ?? a.returned_from_vendor_on ?? '',

  createdAt: a.createdAt ?? a.created_at ?? '',
});

  // ✅ FETCH DATA (FIXED)
  useEffect(() => {
    fetch('http://localhost:5000/assets')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(mapAsset);   // 🔥 FIX HERE
        setAssets(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const addHistoryEntry = useCallback((
    assetId: string,
    action: HistoryEntry['action'],
    by: string,
    to: string,
    note: string
  ) => {
    setHistory(prev => [
      ...prev,
      {
        id: nextHistoryId++,
        assetId,
        action,
        by,
        to,
        date: today(),
        note
      }
    ]);
  }, []);

  // ✅ ADD
  const addAsset = useCallback(async (data: AssetFormData & Partial<IssueFormData>) => {
    const res = await fetch('http://localhost:5000/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const newAssetRaw = await res.json();
    const newAsset = mapAsset(newAssetRaw);   // 🔥 FIX

    setAssets(prev => [newAsset, ...prev]);

    addHistoryEntry(newAsset.id, 'Added', 'Admin', '', 'New asset');

  }, [addHistoryEntry]);

  // ✅ EDIT
  const editAsset = useCallback(async (id: string, data: any) => {
    const res = await fetch(`http://localhost:5000/assets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const updatedRaw = await res.json();
    const updated = mapAsset(updatedRaw);   // 🔥 FIX

    setAssets(prev =>
      prev.map(a => (a.id === id ? updated : a))
    );

  }, []);

  // ✅ ISSUE
const issueAsset = useCallback((id: string, data: IssueFormData) => {
  return editAsset(id, {
    status: 'issued',
    issuedTo: data.issuedTo,
    issuedBy: data.issuedBy,
    issuedOn: data.issuedOn,
    returnDate: data.returnDate,

    // 🔥 ADD THIS
    employeeId: data.employeeId,
    issuedEmail: data.issuedEmail,
  });
}, []);
  // ✅ RETURN (FIXED)
  const returnAsset = useCallback((id: string) => {
    const todayDate = new Date().toISOString().split('T')[0];

    return editAsset(id, {
      status: 'available',
      returnDate: todayDate,
    });
  }, [editAsset]);

  // ✅ DELETE
  const deleteAsset = useCallback(async (id: string) => {
    await fetch(`http://localhost:5000/assets/${id}`, {
      method: 'DELETE',
    });

    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  const getAssetHistory = useCallback((id: string) => {
    return history.filter(h => h.assetId === id);
  }, [history]);

  // ✅ FILTER
  // ✅ FILTER (FIXED)
const filterAssets = useCallback((filter: FilterType, search: string) => {

  return assets.filter(a => {

    // 🔥 NEW RETURN FILTER
    if (filter === 'returned') {
      return !!a.returnDate;
    }

    if (filter !== 'all') {
      if (['issued', 'available', 'maintenance', 'retired'].includes(filter)) {
        if (a.status !== filter) return false;
      } else {
        if (a.type !== filter) return false;
      }
    }

    if (search) {
  const q = search.toLowerCase();
  return (
    a.name?.toLowerCase().includes(q) ||
    a.serial?.toLowerCase().includes(q) ||
    a.employeeId?.toLowerCase().includes(q) ||   // 🔥 NEW
    a.issuedEmail?.toLowerCase().includes(q) ||  // 🔥 NEW
    a.issuedTo?.toLowerCase().includes(q)
  );
}

    return true;

  });

}, [assets]);



const stats = useMemo((): Stats => ({
  total: assets.length,
  issued: assets.filter(a => a.status === 'issued').length,

  // 🔥 FIXED AVAILABLE
  available: assets.filter(a => a.status === 'available' && !a.returnDate).length,

  maintenance: assets.filter(a => a.status === 'maintenance').length,
  retired: assets.filter(a => a.status === 'retired').length,

  // 🔥 NEW
  returned: assets.filter(a => a.returnDate).length,

  laptops: assets.filter(a => a.type === 'laptop').length,
  access_cards: assets.filter(a => a.type === 'access_card').length,
  others: assets.filter(a => a.type === 'other').length,
}), [assets]);

  return {
    assets,
    history,
    stats,
    addAsset,
    editAsset,
    issueAsset,
    returnAsset,
    deleteAsset,
    getAssetHistory,
    filterAssets,
  };
}