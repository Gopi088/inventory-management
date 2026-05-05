import React, { useState } from 'react';
import { Asset } from '../types';
import { today } from '../utils/helpers';

interface Props {
  asset: Asset;
  onSave: (data: any) => void;
  onClose: () => void;
}

export const MaintenanceForm: React.FC<Props> = ({ asset, onSave, onClose }) => {

  const [form, setForm] = useState({
    issue: '',
    vendor: '',
    cost: '',
    startDate: today(),        // ✅ default today
    expectedReturn: '',
  });

  const [errors, setErrors] = useState<{
    issue?: string;
    startDate?: string;
  }>({});

  const set = (key: string, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  // 🔥 VALIDATION
  const validate = () => {
    const errs: any = {};

    if (!form.issue.trim()) {
      errs.issue = 'Issue description is required';
    }

    if (!form.startDate) {
      errs.startDate = 'Start date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave(form);
  };

  return (
    <>
      {/* 🔥 Asset Info */}
      <div className="detail-panel" style={{ marginBottom: 16 }}>
        <strong>{asset.name}</strong>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          {asset.serial} · {asset.brand}
        </div>
      </div>

      <div className="form-grid">

        {/* ISSUE */}
        <div className="form-group form-full">
          <label className="form-label">Issue Description *</label>
          <input
            className={`form-input ${errors.issue ? 'error' : ''}`}
            value={form.issue}
            onChange={e => set('issue', e.target.value)}
            placeholder="Describe the problem..."
          />
          {errors.issue && <span className="form-error">{errors.issue}</span>}
        </div>

        {/* VENDOR */}
        <div className="form-group">
          <label className="form-label">Repair Vendor</label>
          <input
            className="form-input"
            value={form.vendor}
            onChange={e => set('vendor', e.target.value)}
            placeholder="Service center / vendor"
          />
        </div>

        {/* COST */}
        <div className="form-group">
          <label className="form-label">Repair Cost</label>
          <input
            className="form-input"
            type="number"
            value={form.cost}
            onChange={e => set('cost', e.target.value)}
            placeholder="₹ amount"
          />
        </div>

        {/* START DATE */}
        <div className="form-group">
          <label className="form-label">Start Date *</label>
          <input
            className={`form-input ${errors.startDate ? 'error' : ''}`}
            type="date"
            value={form.startDate}
            onChange={e => set('startDate', e.target.value)}
          />
          {errors.startDate && <span className="form-error">{errors.startDate}</span>}
        </div>

        {/* RETURN DATE */}
        <div className="form-group">
          <label className="form-label">Expected Return</label>
          <input
            className="form-input"
            type="date"
            value={form.expectedReturn}
            onChange={e => set('expectedReturn', e.target.value)}
          />
        </div>

      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>

        <button className="btn btn-primary" onClick={handleSave}>
          Send to Maintenance 🔧
        </button>
      </div>
    </>
  );
};