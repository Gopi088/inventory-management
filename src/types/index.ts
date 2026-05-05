export type AssetType = 'laptop' | 'access_card' | 'phone' | 'other';

export type AssetStatus =
  | 'available'
  | 'issued'
  | 'maintenance'
  | 'retired';

export type AssetCondition =
  | 'New'
  | 'Good'
  | 'Under Repair'
  | 'Damaged';

export type HistoryAction =
  | 'Added'
  | 'Issued'
  | 'Returned'
  | 'Edited'
  | 'Deleted';

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  serial: string;
  brand: string;
  model: string;
  status: AssetStatus;
  condition: AssetCondition;
  notes: string;
  issuedTo: string;
  issuedBy: string;
  issuedOn: string;
  returnDate: string;
  vendor?: string;
  maintenanceIssue?: string;
  employeeId?: string;
  issuedEmail?: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: number;
  assetId: string;
  action: HistoryAction;
  by: string;
  to: string;
  date: string;
  note: string;
}

export interface AssetFormData {
  type: AssetType;
  name: string;
  serial: string;
  brand: string;
  model: string;
  status: AssetStatus;
  condition: AssetCondition;
  notes: string;
}

export interface IssueFormData {
  issuedTo: string;
  issuedBy: string;
  issuedOn: string;
  issuedEmail?: string;
  employeeId?: string;
  returnDate: string;
  notes: string;
}

export type NavPage = 'dashboard' | 'inventory' | 'history';

/* 🔥 IMPORTANT */
export type FilterType =
  | 'all'
  | AssetType
  | AssetStatus
  | 'returned';   // ✅ NEW

export interface Stats {
  total: number;
  issued: number;
  available: number;
  maintenance: number;
  retired: number;
  returned: number; // ✅ NEW
  laptops: number;
  access_cards: number;
  others: number;
}