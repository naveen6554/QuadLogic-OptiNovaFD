import React, { useState } from 'react';
import { X, Camera, Glasses, Sparkles, RefreshCw, Check } from 'lucide-react';

export const VirtualTryOnModal = ({ isOpen, onClose }) => {
  const [selectedFrame, setSelectedFrame] = useState('gold_aviator');
  const [cameraActive, setCameraActive] = useState(false);

  if (!isOpen) return null;

  const frames = [
    { id: 'gold_aviator', name: 'Titanium Gold Aviator', color: '#D4AF37' },
    { id: 'blue_shield', name: 'Stellar Blue Shield', color: '#38BDF8' },
    { id: 'rose_acetate', name: 'Monaco Rose Acetate', color: '#FB7185' },
    { id: 'green_hd', name: 'OptiClear HD Green', color: '#34D399' }
  ];

  const activeColor = frames.find(f => f.id === selectedFrame)?.color || '#D4AF37';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Camera size={22} style={{ color: '#D4AF37' }} />
            <h3 className="modal-title">3D Virtual Eyewear Fitting</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div 
          style={{ 
            height: 300, 
            background: 'linear-gradient(180deg, #101625 0%, #080C14 100%)', 
            borderRadius: 16, 
            border: '1px solid var(--border-accent)', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justify: 'center',
            position: 'relative',
            marginBottom: '1.25rem',
            overflow: 'hidden'
          }}
        >
          {cameraActive ? (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#38BDF8', position: 'absolute', top: 12, left: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34D399', display: 'inline-block' }}></span>
                Camera Active • Real-time Pupil Tracking
              </div>

              {/* Simulated Face Outline */}
              <div style={{ width: 140, height: 180, borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.2)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Glasses size={120} color={activeColor} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 15px ${activeColor})` }} />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <Glasses size={80} color={activeColor} style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Click below to enable live camera tracking or simulate 3D face fitting
              </p>
              <button className="btn-primary" style={{ width: 'auto', margin: '0 auto', padding: '0.65rem 1.5rem' }} onClick={() => setCameraActive(true)}>
                <Camera size={16} />
                Enable Camera Simulation
              </button>
            </div>
          )}
        </div>

        {/* Frame selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Select Frame Style:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {frames.map((frame) => (
              <button
                key={frame.id}
                onClick={() => setSelectedFrame(frame.id)}
                style={{
                  padding: '0.75rem',
                  background: selectedFrame === frame.id ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-surface)',
                  border: `1px solid ${selectedFrame === frame.id ? 'var(--primary-gold)' : 'var(--border-subtle)'}`,
                  borderRadius: 12,
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: frame.color }}></div>
                <span style={{ fontSize: '0.85rem', flex: 1 }}>{frame.name}</span>
                {selectedFrame === frame.id && <Check size={14} color="#D4AF37" />}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-secondary" onClick={onClose}>
          Done Fitting
        </button>
      </div>
    </div>
  );
};
