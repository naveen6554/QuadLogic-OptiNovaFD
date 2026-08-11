import React from 'react';
import { Eye, UserCheck, ArrowRight } from 'lucide-react';

export const UserManagementSection = ({ onActionClick }) => {
  const userActions = [
    {
      id: 'view_users',
      title: 'View Users',
      description: 'Fetch and display registered customer profiles, emails, and account creation dates',
      icon: Eye,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.15)',
      action: 'view_users'
    },
    {
      id: 'modify_users',
      title: 'Modify Users',
      description: 'Update user account information, manage administrative permissions, and roles',
      icon: UserCheck,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.15)',
      action: 'modify_user'
    }
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>👥 User Management</span>
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          Manage customer accounts, roles, and administrative access
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {userActions.map((act) => {
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
    </div>
  );
};
