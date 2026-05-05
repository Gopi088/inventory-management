import React, { useState } from 'react';
import { AssetFormData } from '../types';

interface Props {
  onSave: (data: AssetFormData) => void;
  onClose: () => void;
}

type AccessCardFormState = AssetFormData & {
  issuedTo: string;
  issuedBy: string;
  issuedOn: string;
  returnDate: string;

  // 🔥 NEW FIELDS
  employeeId?: string;
  issuedEmail?: string;

  // 🔥 maintenance fields
  maintenanceIssue?: string;
  vendor?: string;
};

export const AccessCardForm: React.FC<Props> = ({ onSave, onClose }) => {

  const [form, setForm] = useState<AccessCardFormState>({
    type: 'access_card',
    name: 'Access Card',
    serial: '',
    brand: 'HID',
    model: '',
    status: 'available',
    condition: 'Good',
    notes: '',

    issuedTo: '',
    issuedBy: '',
    issuedOn: '',
    returnDate: '',

    employeeId: '',       // ✅ NEW
    issuedEmail: '',      // ✅ NEW

    maintenanceIssue: '',
    vendor: '',
  });

  const set = (key: keyof AccessCardFormState, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    let finalData = { ...form };

    // 🔥 CLEAN ISSUE DATA
    if (form.status !== 'issued') {
      finalData.issuedTo = '';
      finalData.issuedBy = '';
      finalData.issuedOn = '';
      finalData.returnDate = '';
      finalData.employeeId = '';
      finalData.issuedEmail = '';
    }

    // 🔥 CLEAN MAINTENANCE DATA
    if (form.status !== 'maintenance') {
      finalData.maintenanceIssue = '';
      finalData.vendor = '';
    }

    onSave(finalData);
  };

  return (
    <>
      <div className="form-grid">

        {/* STATUS */}
        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="available">Available</option>
            <option value="issued">Issued</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="form-group">
          <label>Card Number</label>
          <input value={form.serial} onChange={e => set('serial', e.target.value)} />
        </div>

        <div className="form-group">
          <label>Access Level</label>
          <input value={form.model} onChange={e => set('model', e.target.value)} placeholder="Floor / Area" />
        </div>

        {/* 🔥 ISSUED SECTION */}
        {form.status === 'issued' && (
          <>
            <div className="form-group">
              <label>Employee ID</label>
              <input
                value={form.employeeId}
                onChange={e => set('employeeId', e.target.value)}
                placeholder="EMP001"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                value={form.issuedEmail}
                onChange={e => set('issuedEmail', e.target.value)}
                placeholder="user@company.com"
              />
            </div>

            <div className="form-group">
              <label>Issued To</label>
              <input value={form.issuedTo} onChange={e => set('issuedTo', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Issued By</label>
              <input value={form.issuedBy} onChange={e => set('issuedBy', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Issue Date</label>
              <input
                type="date"
                value={form.issuedOn}
                onChange={e => set('issuedOn', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Return Date</label>
              <input
                type="date"
                value={form.returnDate}
                onChange={e => set('returnDate', e.target.value)}
              />
            </div>
          </>
        )}

        {/* 🔥 MAINTENANCE SECTION */}
        {form.status === 'maintenance' && (
          <>
            <div className="form-group">
              <label>Issue Description</label>
              <input
                value={form.maintenanceIssue}
                onChange={e => set('maintenanceIssue', e.target.value)}
                placeholder="What problem?"
              />
            </div>

            <div className="form-group">
              <label>Vendor</label>
              <input
                value={form.vendor}
                onChange={e => set('vendor', e.target.value)}
                placeholder="Repair vendor"
              />
            </div>
          </>
        )}

      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>

        <button className="btn btn-primary" onClick={handleSave}>
          Add Card
        </button>
      </div>
    </>
  );
};