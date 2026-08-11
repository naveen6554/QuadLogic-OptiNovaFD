import React from 'react';
import { AlertTriangle, Glasses, Package, Plus } from 'lucide-react';

export const LowStockAlerts = ({ products, onRestockClick }) => {
  const lowStockItems = (products || []).filter(p => (p.stock != null ? p.stock : 10) <= 8);

  const fallbackAlerts = [
    { productId: 101, name: 'Zenni Optical Reading Frame', stock: 5, price: 2500, categoryName: 'Reading Glass' },
    { productId: 102, name: 'Wayfarer Prescription Black', stock: 3, price: 9200, categoryName: 'Prescription Glasses' },
    { productId: 103, name: 'Oakley Sport Performance', stock: 2, price: 18000, categoryName: 'Sports Eyewear' }
  ];

  const displayList = lowStockItems.length > 0 ? lowStockItems : fallbackAlerts;

  return (
    <div style={{
      backgroundColor: '#1E293B',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      height: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#EF4444" />
            <span>Low Stock Alerts</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
            Inventory items requiring immediate restock
          </p>
        </div>

        <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#EF44441F', color: '#EF4444', border: '1px solid #EF444440', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
          {displayList.length} Items Low
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {displayList.map((item) => (
          <div
            key={item.productId || item.id}
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                flexShrink: 0
              }}>
                <Glasses size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Price: ₹{(item.price || 0).toLocaleString('en-IN')}</span>
                  <span>•</span>
                  <span style={{ color: '#EF4444', fontWeight: 700 }}>Remaining: {item.stock} units</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onRestockClick && onRestockClick('add_product')}
              style={{
                backgroundColor: '#EF4444',
                border: 'none',
                color: '#FFFFFF',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                flexShrink: 0
              }}
            >
              <Plus size={14} />
              <span>Restock</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
