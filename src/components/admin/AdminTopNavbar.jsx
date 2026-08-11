import React, { useState } from 'react';
import { 
  Bell, Calendar, CheckCircle2, ShoppingBag, AlertTriangle, UserPlus, X, Glasses, Check, Trash2, ArrowRight, CreditCard, Package 
} from 'lucide-react';

export const AdminTopNavbar = ({ 
  currentUser, 
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAllAsRead,
  onClearAll,
  onNavigateToNotifications
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

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
    if (type === 'PAYMENT_FAILED' || type === 'ORDER_CANCELLED') return AlertTriangle;
    if (type === 'LOW_STOCK' || type === 'OUT_OF_STOCK') return AlertTriangle;
    if (category === 'USER') return UserPlus;
    if (category === 'PRODUCT') return Package;
    if (category === 'PAYMENT') return CreditCard;
    return ShoppingBag;
  };

  return (
    <header style={{
      height: '70px',
      backgroundColor: '#111827',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: '#3B82F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          <Glasses size={20} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '0.5px' }}>
            OptiNova Admin
          </h1>
        </div>
      </div>

      {/* Right Controls: Date, Notification Bell, Admin Profile ONLY (No Logout) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Date Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.45rem 0.85rem',
          borderRadius: '8px',
          fontSize: '0.84rem',
          color: '#94A3B8',
          fontWeight: 600
        }}>
          <Calendar size={15} color="#3B82F6" />
          <span>{currentDateStr}</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Notifications"
          >
            <Bell size={18} color="#94A3B8" />
            
            {/* Live Unread Badge Count */}
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 800,
                borderRadius: '9999px',
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: '2px solid #111827'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Overlay */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '360px',
              backgroundColor: '#1E293B',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              padding: '1.1rem',
              zIndex: 100
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#FFFFFF' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{ backgroundColor: '#EF44441F', color: '#EF4444', border: '1px solid #EF444440', fontSize: '0.72rem', fontWeight: 700, padding: '1px 6px', borderRadius: '9999px' }}>
                      {unreadCount} Unread
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button onClick={onMarkAllAsRead} style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }} title="Mark all read">Read All</button>
                  <button onClick={onClearAll} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }} title="Clear all">Clear</button>
                  <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', marginLeft: '4px' }}><X size={16} /></button>
                </div>
              </div>

              {/* Items List */}
              {(!notifications || notifications.length === 0) ? (
                <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94A3B8' }}>
                  <Bell size={32} color="#64748B" style={{ marginBottom: '8px' }} />
                  <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.9rem' }}>No new notifications.</div>
                  <div style={{ fontSize: '0.76rem', marginTop: '2px' }}>You are all caught up with store updates!</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '2px' }}>
                  {notifications.slice(0, 5).map((n) => {
                    const Icon = getIconComponent(n.category, n.type);
                    const color = getCategoryColor(n.category, n.type);

                    return (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          if (onNotificationClick) onNotificationClick(n);
                          setShowNotifications(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.65rem 0.75rem',
                          borderRadius: '10px',
                          backgroundColor: n.isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(59, 130, 246, 0.08)',
                          border: n.isRead ? '1px solid transparent' : `1px solid ${color}30`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(59, 130, 246, 0.08)'}
                      >
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={16} color={color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>{n.title}</span>
                            {!n.isRead && <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color }} />}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.15rem', lineHeight: '1.3' }}>{n.desc}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.2rem' }}>{n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Dropdown Panel Footer */}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    if (onNavigateToNotifications) onNavigateToNotifications();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3B82F6',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>View All Notifications</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '2px solid rgba(59, 130, 246, 0.3)'
          }}>
            {currentUser?.username?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
              {currentUser?.username || 'Admin'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
              ● Administrator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
