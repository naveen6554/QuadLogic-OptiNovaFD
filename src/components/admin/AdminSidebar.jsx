import React from 'react';
import { 
  LayoutDashboard, Package, Users, ShoppingCart, BarChart3, Settings, LogOut, 
  ChevronLeft, ChevronRight, Glasses, Bell
} from 'lucide-react';

export const AdminSidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  activeSection, 
  setActiveSection, 
  onActionClick, 
  onLogout 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, action: 'overall_business' },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside style={{
      width: isCollapsed ? '80px' : '260px',
      minWidth: isCollapsed ? '80px' : '260px',
      backgroundColor: '#111827',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'sticky',
      top: 0,
      height: '100vh',
      zIndex: 40,
      userSelect: 'none'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: isCollapsed ? '1.25rem 0.5rem' : '1.25rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        height: '70px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            flexShrink: 0
          }}>
            <Glasses size={22} />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.5px' }}>
                OptiNova
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Admin Control Panel
              </div>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              borderRadius: '6px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Collapse Sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          style={{
            margin: '0.75rem auto 0 auto',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#94A3B8',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Expand Sidebar"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Navigation List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const hasChildren = Boolean(item.children);

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  setActiveSection(item.id);
                  if (item.action && onActionClick) {
                    onActionClick(item.action);
                  }
                  if (item.id === 'products') setProductsOpen(!productsOpen);
                  if (item.id === 'users') setUsersOpen(!usersOpen);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '0.75rem 0' : '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  color: isActive ? '#3B82F6' : '#94A3B8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={20} color={isActive ? '#3B82F6' : '#94A3B8'} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div style={{
        padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '0.75rem',
            padding: '0.65rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#EF4444',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
          }}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
