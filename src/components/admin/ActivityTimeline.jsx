import React from 'react';
import { Activity, PlusCircle, UserPlus, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ActivityTimeline = () => {
  const activities = [
    {
      id: 1,
      type: 'product_added',
      title: 'New Product Added',
      description: 'Zenni Optical Reading Glass added to catalog (Stock: 45)',
      time: '15 minutes ago',
      icon: PlusCircle,
      color: '#3B82F6',
      badgeBg: '#3B82F61A'
    },
    {
      id: 2,
      type: 'order_completed',
      title: 'Order Completed',
      description: 'Order #ORD-792AE88A delivered to Naveen10',
      time: '42 minutes ago',
      icon: CheckCircle,
      color: '#10B981',
      badgeBg: '#10B9811A'
    },
    {
      id: 3,
      type: 'user_registered',
      title: 'User Registered',
      description: 'Customer sarah_vision completed registration',
      time: '2 hours ago',
      icon: UserPlus,
      color: '#A78BFA',
      badgeBg: '#A78BFA1A'
    },
    {
      id: 4,
      type: 'low_stock',
      title: 'Low Stock Alert',
      description: 'Oakley Sport Performance fell below safety threshold (5 units)',
      time: '4 hours ago',
      icon: AlertTriangle,
      color: '#EF4444',
      badgeBg: '#EF44441A'
    },
    {
      id: 5,
      type: 'admin_login',
      title: 'Admin Gate Authenticated',
      description: 'Administrator logged in from IP 192.168.1.45',
      time: '6 hours ago',
      icon: ShieldCheck,
      color: '#F59E0B',
      badgeBg: '#F59E0B1A'
    }
  ];

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
            <Activity size={20} color="#10B981" />
            <span>Recent Activities</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
            Audit log of system events & actions
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
        {activities.map((act, index) => {
          const Icon = act.icon;
          return (
            <div key={act.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}>
              {/* Vertical connector line */}
              {index !== activities.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '17px',
                  top: '34px',
                  bottom: '-12px',
                  width: '2px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  zIndex: 0
                }} />
              )}

              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: act.badgeBg,
                border: `1px solid ${act.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1
              }}>
                <Icon size={18} color={act.color} />
              </div>

              <div style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {act.title}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    {act.time}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
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
