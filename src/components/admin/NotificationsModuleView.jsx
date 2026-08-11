import React, { useState } from 'react';
import { 
  Bell, ShoppingBag, CreditCard, Users, Package, AlertTriangle, CheckCircle2, XCircle, Trash2, Check, ArrowRight, Eye 
} from 'lucide-react';

export const NotificationsModuleView = ({ 
  notifications, 
  onMarkAsRead, 
  onDeleteNotification, 
  onNotificationClick,
  onMarkAllAsRead,
  onClearAll
}) => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Filter Notification Types
  const filteredNotifications = (notifications || []).filter(n => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ORDERS') return n.category === 'ORDER';
    if (activeFilter === 'PAYMENTS') return n.category === 'PAYMENT';
    if (activeFilter === 'USERS') return n.category === 'USER';
    if (activeFilter === 'PRODUCTS') return n.category === 'PRODUCT';
    if (activeFilter === 'SYSTEM') return n.category === 'SYSTEM';
    return true;
  });

  // Group by Time Horizon: Today, Yesterday, Earlier
  const todayNotifications = filteredNotifications.filter(n => n.horizon === 'TODAY');
  const yesterdayNotifications = filteredNotifications.filter(n => n.horizon === 'YESTERDAY');
  const earlierNotifications = filteredNotifications.filter(n => n.horizon === 'EARLIER');

  const getCategoryColor = (category, type) => {
    if (type === 'PAYMENT_SUCCESS' || type === 'ORDER_DELIVERED') return '#10B981';
    if (type === 'PAYMENT_FAILED' || type === 'ORDER_CANCELLED' || type === 'OUT_OF_STOCK') return '#EF4444';
    if (type === 'LOW_STOCK') return '#F59E0B';
    if (category === 'USER') return '#A78BFA';
    if (category === 'ORDER') return '#3B82F6';
    return '#3B82F6';
  };

  const getIconComponent = (category, type) => {
    if (type === 'PAYMENT_SUCCESS') return CheckCircle2;
    if (type === 'PAYMENT_FAILED' || type === 'ORDER_CANCELLED') return XCircle;
    if (type === 'LOW_STOCK' || type === 'OUT_OF_STOCK') return AlertTriangle;
    if (category === 'USER') return Users;
    if (category === 'PRODUCT') return Package;
    if (category === 'PAYMENT') return CreditCard;
    return ShoppingBag;
  };

  const renderNotificationGroup = (title, items) => {
    if (items.length === 0) return null;

    return (
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#94A3B8', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          {title} ({items.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((n) => {
            const Icon = getIconComponent(n.category, n.type);
            const color = getCategoryColor(n.category, n.type);

            return (
              <div
                key={n.id}
                style={{
                  backgroundColor: n.isRead ? '#1E293B' : 'rgba(59, 130, 246, 0.08)',
                  border: n.isRead ? '1px solid rgba(255, 255, 255, 0.08)' : `1px solid ${color}40`,
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Left Content */}
                <div 
                  onClick={() => onNotificationClick && onNotificationClick(n)}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', flex: 1 }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: `${color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={22} color={color} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
                        {n.title}
                      </span>
                      {!n.isRead && (
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          display: 'inline-block'
                        }} />
                      )}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#94A3B8', marginTop: '3px' }}>
                      {n.desc}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                      {n.time}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {!n.isRead && (
                    <button
                      onClick={() => onMarkAsRead && onMarkAsRead(n.id)}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#3B82F6',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Mark as Read"
                    >
                      <Check size={14} />
                      <span>Mark Read</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteNotification && onDeleteNotification(n.id)}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#EF4444',
                      padding: '6px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    title="Delete Notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Title & Top Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={26} color="#3B82F6" />
            <span>Store Event Notifications</span>
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Real-time audit alerts for customer orders, payments, user accounts, and inventory stock
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onMarkAllAsRead}
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#3B82F6',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={16} />
            <span>Mark All as Read</span>
          </button>

          <button
            onClick={onClearAll}
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Category Filters Row */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '14px'
      }}>
        {[
          { id: 'ALL', label: 'All Notifications' },
          { id: 'ORDERS', label: 'Orders' },
          { id: 'PAYMENTS', label: 'Payments' },
          { id: 'USERS', label: 'Users' },
          { id: 'PRODUCTS', label: 'Products & Stock' },
          { id: 'SYSTEM', label: 'System' }
        ].map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                backgroundColor: isActive ? '#3B82F6' : 'rgba(255, 255, 255, 0.04)',
                border: 'none',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Notification Lists Grouped by Time */}
      {filteredNotifications.length === 0 ? (
        <div style={{
          padding: '60px 24px',
          textAlign: 'center',
          backgroundColor: '#1E293B',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#94A3B8'
        }}>
          <Bell size={48} color="#64748B" style={{ marginBottom: '16px' }} />
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
            No new notifications.
          </div>
          <div style={{ fontSize: '0.86rem', marginTop: '4px' }}>
            There are currently no real store event notifications in this category.
          </div>
        </div>
      ) : (
        <div>
          {renderNotificationGroup('Today', todayNotifications)}
          {renderNotificationGroup('Yesterday', yesterdayNotifications)}
          {renderNotificationGroup('Earlier', earlierNotifications)}
        </div>
      )}
    </div>
  );
};
