import React from 'react';
import { Eye, CheckCircle, Clock, XCircle, ShoppingBag, ArrowUpRight } from 'lucide-react';

export const RecentOrdersTable = ({ salesOrders, onViewOrderDetails }) => {
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'DELIVERED':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#10B9811F',
            color: '#10B981',
            border: '1px solid #10B98140'
          }}>
            <CheckCircle size={12} /> Delivered
          </span>
        );
      case 'PENDING':
      case 'PROCESSING':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#F59E0B1F',
            color: '#F59E0B',
            border: '1px solid #F59E0B40'
          }}>
            <Clock size={12} /> Pending
          </span>
        );
      case 'CANCELLED':
      case 'FAILED':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#EF44441F',
            color: '#EF4444',
            border: '1px solid #EF444440'
          }}>
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#10B9811F',
            color: '#10B981',
            border: '1px solid #10B98140'
          }}>
            <CheckCircle size={12} /> Delivered
          </span>
        );
    }
  };

  return (
    <div style={{
      backgroundColor: '#1E293B',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px',
      padding: '1.5rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="#3B82F6" />
            <span>Recent Orders</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
            Live customer orders and fulfillment activity
          </p>
        </div>

        <button
          onClick={() => onViewOrderDetails && onViewOrderDetails('day_business')}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#3B82F6',
            padding: '0.4rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <span>View All Orders</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
              <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
              <th style={{ padding: '0.85rem 1rem' }}>Products</th>
              <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem' }}>Payment</th>
              <th style={{ padding: '0.85rem 1rem' }}>Date</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
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
                <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#3B82F6' }}>
                  {order.orderId || '#ORD-999'}
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#FFFFFF', fontWeight: 600 }}>
                  {order.customerName || 'Naveen10'}
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#94A3B8' }}>
                  <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{order.name || 'OptiNova Frame'}</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Qty: {order.quantity || 1} • {order.category || 'Eyewear'}</div>
                </td>
                <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#10B981' }}>
                  ₹{(Number(order.totalPrice) || 2500).toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  {getStatusBadge(order.status)}
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#94A3B8', fontSize: '0.82rem' }}>
                  <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                    Prepaid / UPI
                  </span>
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#94A3B8', fontSize: '0.82rem' }}>
                  {order.orderDate || 'Recent'}
                </td>
                <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => onViewOrderDetails && onViewOrderDetails('day_business')}
                    style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#3B82F6',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
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
  );
};
