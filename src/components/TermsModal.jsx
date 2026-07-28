import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

export const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText className="input-icon" size={22} style={{ position: 'static', color: '#D4AF37' }} />
            <h3 className="modal-title">Terms of Service</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '1rem' }}>
            Welcome to <strong>OptiNova Eyewear</strong>. By creating an account and placing orders with our boutique, you agree to the following terms and guidelines.
          </p>

          <h4 style={{ color: '#FFF', marginTop: '1rem', marginBottom: '0.4rem' }}>1. Prescription Accuracy</h4>
          <p style={{ marginBottom: '1rem' }}>
            All prescription orders are customized based on user input or valid doctor documentation. Verification of pupil distance (PD) is conducted via our digital fitting tool.
          </p>

          <h4 style={{ color: '#FFF', marginTop: '1rem', marginBottom: '0.4rem' }}>2. Data Protection & Privacy</h4>
          <p style={{ marginBottom: '1rem' }}>
            Your personal information, address, and mobile phone details are protected under 256-bit encryption. We never sell your data to third parties.
          </p>

          <h4 style={{ color: '#FFF', marginTop: '1rem', marginBottom: '0.4rem' }}>3. Warranty & Returns</h4>
          <p style={{ marginBottom: '1.5rem' }}>
            OptiNova offers a 30-day money-back guarantee and a 1-year anti-scratch coating warranty on all premium lenses.
          </p>

          <button className="btn-primary" onClick={onClose}>
            <ShieldCheck size={18} />
            I AGREE & UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
};
