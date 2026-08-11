import React from 'react';
import { Plus, Eye, Edit3, Trash2, ArrowRight } from 'lucide-react';

export const ProductManagementSection = ({ onActionClick }) => {
  const productActions = [
    {
      id: 'add_product',
      title: 'Add Product',
      description: 'Create new optical eyewear listings with image preview, stock & pricing rules',
      icon: Plus,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.15)',
      action: 'add_product'
    },
    {
      id: 'view_products',
      title: 'View Products',
      description: 'Browse complete inventory catalog with search, category filtering & status',
      icon: Eye,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.15)',
      action: 'delete_product'
    },
    {
      id: 'edit_product',
      title: 'Edit Product',
      description: 'Update frame names, descriptions, prices, categories and stock levels',
      icon: Edit3,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.15)',
      action: 'delete_product'
    },
    {
      id: 'delete_product',
      title: 'Delete Product',
      description: 'Permanently remove discontinued glasses or frames from database',
      icon: Trash2,
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.15)',
      action: 'delete_product'
    }
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📦 Product Management</span>
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          Manage catalog inventory, pricing, and product listings
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {productActions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              onClick={() => onActionClick && onActionClick(act.action)}
              style={{
                backgroundColor: '#1E293B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#273549';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = `${act.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: act.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} color={act.color} />
                </div>
                <div style={{ color: act.color, opacity: 0.8 }}>
                  <ArrowRight size={18} />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {act.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                  {act.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
