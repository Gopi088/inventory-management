import React, { useState } from 'react';
import { Asset, IssueFormData } from '../types';
import { typeIcon, typeColorClass } from '../utils/helpers';
import { today } from '../utils/helpers';

interface IssueFormProps {
  asset: Asset;
  onSave: (data: IssueFormData) => void;
  onClose: () => void;
}

export const IssueForm: React.FC<IssueFormProps> = ({ asset, onSave, onClose }) => {
  const [form, setForm] = useState<IssueFormData>({
    issuedTo: '',
    issuedBy: '',
    issuedOn: today(),
    returnDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{ issuedTo?: string; issuedBy?: string }>({});

  const set = <K extends keyof IssueFormData>(key: K, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const errs: { issuedTo?: string; issuedBy?: string } = {};
    if (!form.issuedTo.trim()) errs.issuedTo = 'Employee name is required';
    if (!form.issuedBy.trim()) errs.issuedBy = 'Issuer name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => { if (validate()) onSave(form); };

  return (
    <>
      <div className="detail-panel" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className={`asset-icon ${typeColorClass(asset.type)}`} style={{ width: 38, height: 38, fontSize: 18 }}>
            {typeIcon(asset.type)}
          </div>
          <div>
            <div className="asset-name">{asset.name}</div>
            <div className="asset-serial">{asset.serial} · {asset.brand} {asset.model}</div>
          </div>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Issue To (Employee) *</label>
          <input className={`form-input ${errors.issuedTo ? 'error' : ''}`} value={form.issuedTo}
            onChange={e => set('issuedTo', e.target.value)} placeholder="Full name of employee" />
          {errors.issuedTo && <span className="form-error">{errors.issuedTo}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Issued By *</label>
          <input className={`form-input ${errors.issuedBy ? 'error' : ''}`} value={form.issuedBy}
            onChange={e => set('issuedBy', e.target.value)} placeholder="Your name / role" />
          {errors.issuedBy && <span className="form-error">{errors.issuedBy}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Issue Date</label>
          <input className="form-input" type="date" value={form.issuedOn}
            onChange={e => set('issuedOn', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Expected Return Date</label>
          <input className="form-input" type="date" value={form.returnDate}
            onChange={e => set('returnDate', e.target.value)} />
        </div>

        <div className="form-group form-full">
          <label className="form-label">Notes</label>
          <input className="form-input" value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Department, floor, purpose of issuance..." />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Issue Asset ↗</button>
      </div>
    </>
  );
};
