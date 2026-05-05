import { Asset, HistoryEntry } from '../types';

export const initialAssets: Asset[] = [
  {
    id: 'A001', type: 'laptop', name: 'MacBook Pro 14"', serial: 'C02XG2JXMD6M',
    brand: 'Apple', model: 'MBP M3 Pro', status: 'issued', condition: 'Good',
    issuedTo: 'Arjun Mehta', issuedBy: 'IT Admin', issuedOn: '2024-11-10',
    returnDate: '', notes: 'Primary work machine', createdAt: '2024-11-01',
  },
  {
    id: 'A002', type: 'access_card', name: 'Access Card', serial: 'AC-20481',
    brand: 'HID', model: 'Proximity Card', status: 'issued', condition: 'Good',
    issuedTo: 'Priya Sharma', issuedBy: 'HR Admin', issuedOn: '2025-01-05',
    returnDate: '', notes: 'Floor 3 access', createdAt: '2025-01-05',
  },
  {
    id: 'A003', type: 'laptop', name: 'ThinkPad X1 Carbon', serial: 'R90N4ZKBPL2X',
    brand: 'Lenovo', model: 'X1 Carbon Gen 11', status: 'available', condition: 'Good',
    issuedTo: '', issuedBy: '', issuedOn: '', returnDate: '',
    notes: 'Refurbished unit', createdAt: '2024-10-15',
  },
  {
    id: 'A004', type: 'access_card', name: 'Master Access Card', serial: 'AC-10092',
    brand: 'HID', model: 'iCLASS Elite', status: 'issued', condition: 'New',
    issuedTo: 'Sneha Rajan', issuedBy: 'Ops Admin', issuedOn: '2025-02-18',
    returnDate: '', notes: 'All-floor access', createdAt: '2025-02-18',
  },
  {
    id: 'A005', type: 'laptop', name: 'MacBook Air 15"', serial: 'C02XA1BCMD6N',
    brand: 'Apple', model: 'MBA M2', status: 'maintenance', condition: 'Under Repair',
    issuedTo: '', issuedBy: '', issuedOn: '', returnDate: '',
    notes: 'Display issue — sent to Apple service', createdAt: '2024-09-20',
  },
  {
    id: 'A006', type: 'phone', name: 'iPhone 15 Pro', serial: 'F7LHN2KR3M',
    brand: 'Apple', model: 'iPhone 15 Pro 256GB', status: 'available', condition: 'New',
    issuedTo: '', issuedBy: '', issuedOn: '', returnDate: '',
    notes: 'Demo device', createdAt: '2025-03-20',
  },
  {
    id: 'A007', type: 'access_card', name: 'Visitor Card', serial: 'AC-30012',
    brand: 'HID', model: 'Proximity Card', status: 'issued', condition: 'Good',
    issuedTo: 'Dev Patel', issuedBy: 'Reception', issuedOn: '2025-04-20',
    returnDate: '2025-04-27', notes: 'Temporary visitor', createdAt: '2025-04-20',
  },
  {
    id: 'A008', type: 'laptop', name: 'Dell XPS 15', serial: '8R2MN3PQ4TT',
    brand: 'Dell', model: 'XPS 15 9530', status: 'issued', condition: 'Good',
    issuedTo: 'Kiran Bhat', issuedBy: 'IT Admin', issuedOn: '2024-12-01',
    returnDate: '', notes: 'Data team — 32GB RAM config', createdAt: '2024-12-01',
  },
];

export const initialHistory: HistoryEntry[] = [
  { id: 1, assetId: 'A001', action: 'Added',  by: 'IT Admin',  to: '',            date: '2024-11-01', note: 'Purchased from Apple Store' },
  { id: 2, assetId: 'A001', action: 'Issued',  by: 'IT Admin',  to: 'Arjun Mehta', date: '2024-11-10', note: 'Initial onboarding assignment' },
  { id: 3, assetId: 'A002', action: 'Issued',  by: 'HR Admin',  to: 'Priya Sharma', date: '2025-01-05', note: 'New hire onboarding' },
  { id: 4, assetId: 'A005', action: 'Returned',by: 'Vikram Nair',to: '',           date: '2025-03-12', note: 'Display cracked — sent for repair' },
  { id: 5, assetId: 'A006', action: 'Added',   by: 'IT Admin',  to: '',            date: '2025-03-20', note: 'New purchase — demo pool' },
  { id: 6, assetId: 'A004', action: 'Issued',  by: 'Ops Admin', to: 'Sneha Rajan', date: '2025-02-18', note: 'Role upgrade to senior ops' },
  { id: 7, assetId: 'A007', action: 'Issued',  by: 'Reception', to: 'Dev Patel',   date: '2025-04-20', note: 'Temporary visitor badge' },
  { id: 8, assetId: 'A008', action: 'Issued',  by: 'IT Admin',  to: 'Kiran Bhat',  date: '2024-12-01', note: 'Data team new hire' },
];
