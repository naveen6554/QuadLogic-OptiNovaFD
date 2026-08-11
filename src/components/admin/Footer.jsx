import React from 'react';

export const Footer = ({ onToast }) => {
  return (
    <footer style={{
      backgroundColor: '#111827',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1.25rem 2rem',
      marginTop: 'auto',
      color: '#94A3B8',
      fontSize: '0.84rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem' }}>OptiNova Admin</span>
          <span style={{ margin: '0 0.5rem', color: '#64748B' }}>|</span>
          <span>Enterprise Eyewear Management System © 2026</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: '#3B82F6' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => onToast && onToast('About OptiNova Enterprise Dashboard', 'info')}>About Us</span>
          <span style={{ cursor: 'pointer' }} onClick={() => onToast && onToast('Support Contact: admin@optinova.com', 'info')}>Contact</span>
          <span style={{ cursor: 'pointer' }} onClick={() => onToast && onToast('Terms of Service verified', 'info')}>Terms of Service</span>
          <span style={{ cursor: 'pointer' }} onClick={() => onToast && onToast('Privacy Policy verified', 'info')}>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};
