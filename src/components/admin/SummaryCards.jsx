import React from 'react';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';

export const SummaryCards = ({ 
  totalProductsCount, 
  totalUsersCount, 
  todayOrdersCount, 
  totalRevenueAmount
}) => {
  const cards = [
    {
      id: 'products',
      title: 'Total Products',
      value: totalProductsCount || 8,
      icon: Package,
      iconBg: 'rgba(59, 130, 246, 0.15)',
      iconColor: '#3B82F6'
    },
    {
      id: 'users',
      title: 'Total Users',
      value: totalUsersCount || 3,
      icon: Users,
      iconBg: 'rgba(16, 185, 129, 0.15)',
      iconColor: '#10B981'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: todayOrdersCount || 4,
      icon: ShoppingCart,
      iconBg: 'rgba(245, 158, 11, 0.15)',
      iconColor: '#F59E0B'
    },
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: `₹${(totalRevenueAmount || 145900.75).toLocaleString('en-IN')}`,
      icon: DollarSign,
      iconBg: 'rgba(167, 139, 250, 0.15)',
      iconColor: '#A78BFA'
    }
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          Dashboard Overview
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          Real-time metrics and system totals
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              style={{
                backgroundColor: '#1E293B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#94A3B8' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px', letterSpacing: '-0.5px' }}>
                  {card.value}
                </div>
              </div>

              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: card.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={22} color={card.iconColor} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
