import React from 'react';
import { Plus, Edit3, Trash2, Users, ShoppingBag, BarChart3, ArrowRight } from 'lucide-react';

export const QuickActionsGrid = ({ onActionClick }) => {
  const actions = [
    {
      id: 'add_product',
      title: 'Add Product',
      description: 'Create new optical eyewear listings with image previews & stock rules',
      icon: Plus,
      color: '#3B82F6',
      bg: '#3B82F615',
      action: 'add_product'
    },
    {
      id: 'edit_product',
      title: 'Edit Product',
      description: 'Modify product details, pricing, categories, and inventory stock',
      icon: Edit3,
      color: '#F59E0B',
      bg: '#F59E0B15',
      action: 'delete_product' // Opens product catalog view
    },
    {
      id: 'delete_product',
      title: 'Delete Product',
      description: 'Remove discontinued frames from OptiNova catalog database',
      icon: Trash2,
      color: '#EF4444',
      bg: '#EF444415',
      action: 'delete_product'
    },
    {
      id: 'manage_users',
      title: 'Manage Users',
      description: 'View customer profiles, update user roles, and manage system access',
      icon: Users,
      color: '#10B981',
      bg: '#10B98115',
      action: 'modify_user'
    },
    {
      id: 'manage_orders',
      title: 'Manage Orders',
      description: 'Review placed customer orders, transaction status, and shipping logs',
      icon: ShoppingBag,
      color: '#A78BFA',
      bg: '#A78BFA15',
      action: 'day_business'
    },
    {
      id: 'business_analytics',
      title: 'Business Analytics',
      description: 'Generate deep revenue reports for daily, monthly, and yearly business',
      icon: BarChart3,
      color: '#38BDF8',
      bg: '#38BDF815',
      action: 'overall_business'
    }
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Quick Actions
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
            Frequently used enterprise management shortcuts
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              onClick={() => onActionClick && onActionClick(act.action)}
              style={{
                backgroundColor: '#1E293B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
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
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: act.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={24} color={act.color} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.3rem', lineHeight: '1.4' }}>
                    {act.description}
                  </div>
                </div>
              </div>

              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: act.color,
                flexShrink: 0
              }}>
                <ArrowRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
