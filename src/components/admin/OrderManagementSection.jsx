import React from 'react';
import { ShoppingBag, Clock, CheckCircle, Eye, ArrowRight } from 'lucide-react';

export const OrderManagementSection = ({ salesOrders, onViewOrderDetails }) => {
  const orderActions = [
    {
      id: 'view_orders',
      title: 'View Orders',
      description: 'Review total customer purchase orders and lifetime checkout logs',
      icon: ShoppingBag,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.15)',
      action: 'day_business'
    },
    {
      id: 'pending_orders',
      title: 'Pending Orders',
      description: 'Track orders undergoing payment processing or fulfillment dispatch',
      icon: Clock,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.15)',
      action: 'day_business'
    },
    {
      id: 'completed_orders',
      title: 'Completed Orders',
      description: 'View successfully delivered orders and confirmed payments',
      icon: CheckCircle,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.15)',
      action: 'day_business'
    }
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📦 Order Management</span>
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          Fulfillment tracking, order statuses, and transaction details
        </p>
      </div>

      {/* 3 Order Action Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {orderActions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              onClick={() => onViewOrderDetails && onViewOrderDetails(act.action)}
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
                minHeight: '150px',
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

      {/* Orders Table */}
      <div style={{
        backgroundColor: '#1E293B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Recent Orders Log
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#3B82F6', fontWeight: 600 }}>
            Live Transactions
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 16px' }}>Order ID</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Payment Status</th>
                <th style={{ padding: '12px 16px' }}>Order Status</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(salesOrders || []).slice(0, 6).map((order, idx) => (
                <tr 
                  key={idx} 
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#3B82F6' }}>
                    {order.orderId || '#ORD-999'}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 600 }}>
                    {order.customerName || 'Naveen10'}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#10B981' }}>
                    ₹{(Number(order.totalPrice) || 2500).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      Paid (Prepaid)
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {order.status || 'Delivered'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '0.82rem' }}>
                    {order.orderDate || 'Recent'}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => onViewOrderDetails && onViewOrderDetails('day_business')}
                      style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#3B82F6',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
