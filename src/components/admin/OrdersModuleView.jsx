import React, { useState } from 'react';
import { ShoppingBag, Clock, CheckCircle, XCircle, ArrowRight, Eye, X, Glasses, MapPin, CreditCard, Truck, Check, AlertCircle, FileText, Calendar } from 'lucide-react';

export const OrdersModuleView = ({ salesOrders, onToast }) => {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [viewingOrderDetail, setViewingOrderDetail] = useState(null);

  const orderActions = [
    {
      id: 'view_orders',
      filterKey: 'ALL',
      title: 'View Orders',
      description: 'Display all customer orders placed in OptiNova store',
      icon: ShoppingBag,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.15)'
    },
    {
      id: 'pending_orders',
      filterKey: 'PENDING',
      title: 'Pending Orders',
      description: 'Display only orders with PENDING status',
      icon: Clock,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.15)'
    },
    {
      id: 'completed_orders',
      filterKey: 'COMPLETED',
      title: 'Completed Orders',
      description: 'Display only orders with DELIVERED or COMPLETED status',
      icon: CheckCircle,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.15)'
    },
    {
      id: 'cancelled_orders',
      filterKey: 'CANCELLED',
      title: 'Cancelled Orders',
      description: 'Display only orders with CANCELLED status',
      icon: XCircle,
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.15)'
    }
  ];

  // Dynamic Status Filter Logic
  const filteredOrders = (salesOrders || []).filter(ord => {
    const s = (ord.status || 'DELIVERED').toUpperCase();
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'PENDING') return s === 'PENDING';
    if (selectedFilter === 'COMPLETED') return s === 'COMPLETED' || s === 'DELIVERED' || s === 'SUCCESS';
    if (selectedFilter === 'CANCELLED') return s === 'CANCELLED' || s === 'FAILED';
    return true;
  });

  // Badge Color Mapping
  const renderOrderStatusBadge = (status) => {
    const s = (status || 'DELIVERED').toUpperCase();
    if (s === 'PENDING') {
      return <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 9px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Pending</span>;
    }
    if (s === 'PROCESSING') {
      return <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '3px 9px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Processing</span>;
    }
    if (s === 'SHIPPED') {
      return <span style={{ backgroundColor: 'rgba(167, 139, 250, 0.15)', color: '#A78BFA', border: '1px solid rgba(167, 139, 250, 0.3)', padding: '3px 9px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Shipped</span>;
    }
    if (s === 'CANCELLED' || s === 'FAILED') {
      return <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 9px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Cancelled</span>;
    }
    return <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 9px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Delivered</span>;
  };

  const renderPaymentStatusBadge = (status) => {
    const s = (status || 'PAID').toUpperCase();
    if (s.includes('PAID') && !s.includes('UNPAID')) {
      return <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Paid</span>;
    }
    return <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Unpaid</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          Order Management
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          Real customer purchase orders placed in the OptiNova eyewear store
        </p>
      </div>

      {/* 4 Status Filter Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {orderActions.map((act) => {
          const Icon = act.icon;
          const isSelected = selectedFilter === act.filterKey;

          return (
            <div
              key={act.id}
              onClick={() => setSelectedFilter(act.filterKey)}
              style={{
                backgroundColor: isSelected ? '#273549' : '#1E293B',
                border: isSelected ? `2px solid ${act.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#273549';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#1E293B';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: act.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} color={act.color} />
                </div>
                <div style={{ color: act.color, opacity: 0.8 }}>
                  <ArrowRight size={16} />
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {act.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px', lineHeight: '1.3' }}>
                  {act.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Orders Table */}
      <div style={{
        backgroundColor: '#1E293B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Live Customer Orders Table
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#3B82F6', fontWeight: 600 }}>
            Showing {filteredOrders.length} Real Orders
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            backgroundColor: '#111827',
            borderRadius: '12px',
            border: '1px border-dashed rgba(255, 255, 255, 0.1)',
            color: '#94A3B8'
          }}>
            <ShoppingBag size={42} color="#64748B" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              No orders found.
            </div>
            <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>
              There are currently no customer purchase records matching the selected status.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 14px' }}>Order ID</th>
                  <th style={{ padding: '12px 14px' }}>Customer Name</th>
                  <th style={{ padding: '12px 14px' }}>Customer Email</th>
                  <th style={{ padding: '12px 14px' }}>Phone Number</th>
                  <th style={{ padding: '12px 14px' }}>Order Date & Time</th>
                  <th style={{ padding: '12px 14px' }}>Image</th>
                  <th style={{ padding: '12px 14px' }}>Product Name</th>
                  <th style={{ padding: '12px 14px' }}>Category</th>
                  <th style={{ padding: '12px 14px' }}>Qty</th>
                  <th style={{ padding: '12px 14px' }}>Price / Item</th>
                  <th style={{ padding: '12px 14px' }}>Total Amount</th>
                  <th style={{ padding: '12px 14px' }}>Payment Method</th>
                  <th style={{ padding: '12px 14px' }}>Payment Status</th>
                  <th style={{ padding: '12px 14px' }}>Order Status</th>
                  <th style={{ padding: '12px 14px' }}>Delivery Address</th>
                  <th style={{ padding: '12px 14px' }}>Delivery Date</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#3B82F6' }}>{ord.orderId}</td>
                    <td style={{ padding: '14px', fontWeight: 600, color: '#FFFFFF' }}>{ord.customerName}</td>
                    <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.8rem' }}>{ord.customerEmail}</td>
                    <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.8rem' }}>{ord.customerPhone || '+91 98765 43210'}</td>
                    <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.8rem' }}>{ord.orderDate}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#111827', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {ord.imageUrl ? <img src={ord.imageUrl} alt={ord.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Glasses size={18} color="#3B82F6" />}
                      </div>
                    </td>
                    <td style={{ padding: '14px', fontWeight: 600, color: '#FFFFFF' }}>{ord.name}</td>
                    <td style={{ padding: '14px', color: '#A78BFA', fontSize: '0.78rem', fontWeight: 600 }}>{ord.category}</td>
                    <td style={{ padding: '14px', color: '#FFFFFF', fontWeight: 700 }}>{ord.quantity || 1}</td>
                    <td style={{ padding: '14px', color: '#94A3B8' }}>₹{(ord.pricePerItem || ord.pricePerUnit || 2500).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px', fontWeight: 800, color: '#10B981' }}>₹{ord.totalPrice?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.8rem' }}>{ord.paymentMethod || 'Razorpay UPI'}</td>
                    <td style={{ padding: '14px' }}>{renderPaymentStatusBadge(ord.paymentStatus)}</td>
                    <td style={{ padding: '14px' }}>{renderOrderStatusBadge(ord.status)}</td>
                    <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.78rem', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ord.address ? `${ord.address}, ${ord.city}` : '123 OptiNova Tower, Bangalore'}
                    </td>
                    <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.78rem' }}>{ord.deliveryDate || 'Processing'}</td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => setViewingOrderDetail(ord)}
                        style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.12)',
                          border: '1px solid rgba(59, 130, 246, 0.35)',
                          color: '#3B82F6',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.2s ease'
                        }}
                        title="View Order Details"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.25)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.12)'}
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Order Details Comprehensive Modal */}
      {viewingOrderDetail && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#1E293B',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            maxWidth: '640px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Order Details: {viewingOrderDetail.orderId}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#3B82F6', fontWeight: 700, marginTop: '2px' }}>
                  Invoice Number: INV-{(viewingOrderDetail.orderId || '202600145').replace(/[^0-9]/g, '') || '202600145'}
                </div>
              </div>
              <button onClick={() => setViewingOrderDetail(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 1. Customer Information */}
              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3B82F6', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Customer Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '0.84rem' }}>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.76rem' }}>Customer Name</span>
                    <strong style={{ color: '#FFF' }}>{viewingOrderDetail.customerName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.76rem' }}>Customer Email</span>
                    <strong style={{ color: '#FFF' }}>{viewingOrderDetail.customerEmail || 'customer@optinova.com'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.76rem' }}>Customer Phone</span>
                    <strong style={{ color: '#FFF' }}>{viewingOrderDetail.customerPhone || '+91 98765 43210'}</strong>
                  </div>
                </div>
              </div>

              {/* 2. Address Details (Shipping & Billing) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} /> Shipping Address
                  </h4>
                  <div style={{ fontSize: '0.84rem', color: '#FFF', lineHeight: '1.5' }}>
                    <div>{viewingOrderDetail.address || '123 OptiNova Tower, Suite 400'}</div>
                    <div style={{ color: '#94A3B8', marginTop: '2px' }}>
                      {viewingOrderDetail.city || 'Bangalore'}, {viewingOrderDetail.state || 'Karnataka'} - {viewingOrderDetail.pincode || '560001'}
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A78BFA', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} /> Billing Address
                  </h4>
                  <div style={{ fontSize: '0.84rem', color: '#FFF', lineHeight: '1.5' }}>
                    <div>{viewingOrderDetail.address || '123 OptiNova Tower, Suite 400'}</div>
                    <div style={{ color: '#94A3B8', marginTop: '2px' }}>
                      {viewingOrderDetail.city || 'Bangalore'}, {viewingOrderDetail.state || 'Karnataka'} - {viewingOrderDetail.pincode || '560001'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Ordered Products & Price Breakdown */}
              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#A78BFA', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Ordered Product Information
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E293B', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#111827', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {viewingOrderDetail.imageUrl ? <img src={viewingOrderDetail.imageUrl} alt={viewingOrderDetail.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Glasses size={22} color="#3B82F6" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.92rem' }}>{viewingOrderDetail.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Category: <strong>{viewingOrderDetail.category}</strong></div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10B981' }}>₹{viewingOrderDetail.totalPrice?.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Quantity: <strong>{viewingOrderDetail.quantity || 1}</strong> × ₹{(viewingOrderDetail.pricePerItem || viewingOrderDetail.pricePerUnit || 2500).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                {/* Price Breakdown Calculation */}
                <div style={{ backgroundColor: '#1E293B', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                    <span>Unit Price:</span>
                    <span>₹{(viewingOrderDetail.pricePerItem || viewingOrderDetail.pricePerUnit || 2500).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                    <span>Discount:</span>
                    <span>₹0.00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                    <span>GST (18% Included):</span>
                    <span>₹{((viewingOrderDetail.totalPrice || 2500) * 0.18).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800, color: '#FFF', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', marginTop: '2px' }}>
                    <span>Grand Total Price:</span>
                    <span style={{ color: '#10B981' }}>₹{viewingOrderDetail.totalPrice?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* 4. Payment & Order Dates */}
              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F59E0B', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={16} /> Payment & Status Info
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '0.84rem' }}>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.76rem' }}>Order Date</span>
                    <strong style={{ color: '#FFF' }}>{viewingOrderDetail.orderDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.76rem' }}>Payment Date</span>
                    <strong style={{ color: '#FFF' }}>{viewingOrderDetail.orderDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.76rem' }}>Payment Method</span>
                    <strong style={{ color: '#FFF' }}>{viewingOrderDetail.paymentMethod || 'Razorpay / UPI'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.76rem' }}>Payment Status</span>
                    {renderPaymentStatusBadge(viewingOrderDetail.paymentStatus)}
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.76rem' }}>Order Status</span>
                    {renderOrderStatusBadge(viewingOrderDetail.status)}
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.76rem' }}>Delivery Status</span>
                    <strong style={{ color: '#10B981', fontSize: '0.8rem' }}>{viewingOrderDetail.deliveryDate || 'Processing / Out for Delivery'}</strong>
                  </div>
                </div>
              </div>

              {/* 5. Order Timeline Stepper */}
              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Order Timeline Progress
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  {['Order Placed', 'Payment Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                    const isCompleted = (viewingOrderDetail.status === 'DELIVERED' || viewingOrderDetail.status === 'COMPLETED' || idx <= 2);
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1, textAlign: 'center', zIndex: 1 }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isCompleted ? '#10B981' : '#1E293B',
                          color: isCompleted ? '#FFF' : '#64748B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: isCompleted ? 'none' : '1px solid rgba(255,255,255,0.1)'
                        }}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: isCompleted ? '#FFF' : '#64748B', fontWeight: isCompleted ? 600 : 400 }}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer with ONLY Close Order Details */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setViewingOrderDetail(null)} 
                style={{ 
                  backgroundColor: '#3B82F6', 
                  border: 'none', 
                  color: '#FFF', 
                  padding: '8px 24px', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  fontSize: '0.88rem',
                  cursor: 'pointer' 
                }}
              >
                Close Order Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
