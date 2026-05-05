import React, { useState, useEffect } from 'react';
import { Asset, AssetFormData, AssetType, AssetStatus, AssetCondition } from '../types';

interface AssetFormProps {
  initial?: Asset;
  onSave: (data: any) => void;
  onClose: () => void;
}

type ExtendedForm = AssetFormData & {
  employeeId?: string;
  issuedEmail?: string;

  // 🔥 maintenance fields
  maintenanceIssue?: string;
  vendor?: string;
  repairCost?: string;
  maintenanceStart?: string;
  expectedReturn?: string;
};

const defaultForm: ExtendedForm = {
  type: 'laptop',
  name: '',
  serial: '',
  brand: '',
  model: '',
  status: 'available',
  condition: 'Good',
  notes: '',
  issuedTo: '',
  issuedBy: '',
  issuedOn: '',
  returnDate: '',
  employeeId: '',
  issuedEmail: '',

  // 🔥 maintenance defaults
  maintenanceIssue: '',
  vendor: '',
  repairCost: '',
  maintenanceStart: '',
  expectedReturn: '',
};

export const AssetForm: React.FC<AssetFormProps> = ({ initial, onSave, onClose }) => {

  const [form, setForm] = useState<ExtendedForm>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AssetFormData, string>>>({});

  // ✅ Load initial safely
  useEffect(() => {
    if (initial) {
      setForm({
        ...defaultForm,
        ...initial,
      });
    }
  }, [initial]);

  const set = <K extends keyof ExtendedForm>(key: K, val: ExtendedForm[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const errs: any = {};

    if (!form.name.trim()) errs.name = 'Asset name is required';
    if (!form.serial.trim()) errs.serial = 'Serial number is required';
    if (!form.brand.trim()) errs.brand = 'Brand is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

 const handleSave = () => {
  if (!validate()) return;

  let finalData: any = {
    ...form,

    // 🔥 ALWAYS SEND THESE
    employeeId: form.employeeId || '',
    issuedEmail: form.issuedEmail || '',
  };

  // 🔥 CLEAN ONLY IF REALLY NEEDED
  if (form.status !== 'issued') {
    finalData.issuedTo = '';
    finalData.issuedBy = '';
    finalData.issuedOn = '';
    finalData.returnDate = '';
  }

  if (form.status !== 'maintenance') {
    finalData.maintenanceIssue = '';
    finalData.vendor = '';
    finalData.repairCost = '';
    finalData.maintenanceStart = '';
    finalData.expectedReturn = '';
  }

  console.log("FINAL SAVE DATA:", finalData); // 🔥 DEBUG

  onSave(finalData);
};

  return (
    <>
      <div className="form-grid">

        {/* TYPE */}
        <div className="form-group form-full">
          <label className="form-label">Asset Type</label>
          <select
            className="form-select"
            value={form.type}
            onChange={e => set('type', e.target.value as AssetType)}
          >
            <option value="laptop">💻 Laptop</option>
            <option value="access_card">🪪 Access Card</option>
            <option value="other">📦 Other Equipment</option>
          </select>
        </div>

        {/* NAME */}
        <div className="form-group">
          <label className="form-label">Asset Name *</label>
          <input
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={form.name || ''}
            onChange={e => set('name', e.target.value)}
          />
        </div>

        {/* SERIAL */}
        <div className="form-group">
          <label className="form-label">Serial Number *</label>
          <input
            className={`form-input ${errors.serial ? 'error' : ''}`}
            value={form.serial || ''}
            onChange={e => set('serial', e.target.value)}
          />
        </div>

        {/* BRAND */}
        <div className="form-group">
          <label className="form-label">Brand *</label>
          <input
            className={`form-input ${errors.brand ? 'error' : ''}`}
            value={form.brand || ''}
            onChange={e => set('brand', e.target.value)}
          />
        </div>

        {/* MODEL */}
        <div className="form-group">
          <label className="form-label">Model</label>
          <input
            className="form-input"
            value={form.model || ''}
            onChange={e => set('model', e.target.value)}
          />
        </div>

        {/* STATUS */}
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={form.status}
            onChange={e => set('status', e.target.value as AssetStatus)}
          >
            <option value="available">Available</option>
            <option value="issued">Issued</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        {/* CONDITION */}
        <div className="form-group">
          <label className="form-label">Condition</label>
          <select
            className="form-select"
            value={form.condition}
            onChange={e => set('condition', e.target.value as AssetCondition)}
          >
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Under Repair">Under Repair</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>

        {/* 🔥 ISSUED */}
        {form.status === 'issued' && (
          <>
            <input className="form-input" value={form.employeeId || ''} onChange={e => set('employeeId', e.target.value)} placeholder="Employee ID" />
            <input className="form-input" value={form.issuedEmail || ''} onChange={e => set('issuedEmail', e.target.value)} placeholder="Email" />
            <input className="form-input" value={form.issuedTo || ''} onChange={e => set('issuedTo', e.target.value)} placeholder="Issued To" />
            <input className="form-input" value={form.issuedBy || ''} onChange={e => set('issuedBy', e.target.value)} placeholder="Issued By" />
            <input className="form-input" type="date" value={form.issuedOn || ''} onChange={e => set('issuedOn', e.target.value)} />
            <input className="form-input" type="date" value={form.returnDate || ''} onChange={e => set('returnDate', e.target.value)} />
          </>
        )}

        {/* 🔥 MAINTENANCE */}
        {form.status === 'maintenance' && (
          <>
            <div className="form-group form-full">
              <label className="form-label">Issue Description *</label>
              <input
                className="form-input"
                value={form.maintenanceIssue || ''}
                onChange={e => set('maintenanceIssue', e.target.value)}
                placeholder="Describe the problem..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Repair Vendor</label>
              <input
                className="form-input"
                value={form.vendor || ''}
                onChange={e => set('vendor', e.target.value)}
                placeholder="Service center / vendor"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Repair Cost</label>
              <input
                className="form-input"
                type="number"
                value={form.repairCost || ''}
                onChange={e => set('repairCost', e.target.value)}
                placeholder="₹ amount"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                className="form-input"
                type="date"
                value={form.maintenanceStart || ''}
                onChange={e => set('maintenanceStart', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Return</label>
              <input
                className="form-input"
                type="date"
                value={form.expectedReturn || ''}
                onChange={e => set('expectedReturn', e.target.value)}
              />
            </div>
          </>
        )}

        {/* NOTES */}
        <div className="form-group form-full">
          <label className="form-label">Notes</label>
          <input
            className="form-input"
            value={form.notes || ''}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>
          {initial ? 'Update Asset' : '+ Add Asset'}
        </button>
      </div>
    </>
  );
};