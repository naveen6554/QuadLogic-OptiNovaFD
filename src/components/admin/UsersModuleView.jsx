import React, { useState, useMemo } from 'react';
import { Users, Eye, Shield, Star, Search, ChevronLeft, ChevronRight, Edit3, X, User, Check, Calendar, Mail, Phone, Lock } from 'lucide-react';

export const UsersModuleView = ({
  usersList = [],
  onActionClick,
  setEditUserTarget,
  setEditUserForm
}) => {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingUserDetail, setViewingUserDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Role & User Metrics
  const totalUsers = usersList.length;
  const customerCount = useMemo(() => usersList.filter(u => u.role !== 'ADMIN' && u.role !== 'ADMINISTRATOR').length, [usersList]);
  const adminCount = useMemo(() => usersList.filter(u => u.role === 'ADMIN' || u.role === 'ADMINISTRATOR').length, [usersList]);
  const activeCount = totalUsers; // All registered users active

  // 4 Summary Cards Specification
  const summaryCards = [
    {
      id: 'total_users',
      filterKey: 'ALL',
      title: 'Total Users',
      subtitle: 'All registered accounts',
      icon: Users,
      count: totalUsers,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.15)'
    },
    {
      id: 'view_users',
      filterKey: 'CUSTOMER',
      title: 'View Users',
      subtitle: 'Customer accounts',
      icon: Eye,
      count: customerCount,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.15)'
    },
    {
      id: 'modify_users',
      filterKey: 'ADMIN',
      title: 'Administrators',
      subtitle: 'Admin level access',
      icon: Shield,
      count: adminCount,
      color: '#A78BFA',
      bg: 'rgba(167, 139, 250, 0.15)'
    },
    {
      id: 'active_users',
      filterKey: 'ACTIVE',
      title: 'Active Users',
      subtitle: 'Active user directory',
      icon: Star,
      count: activeCount,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.15)'
    }
  ];

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const isAdmin = u.role === 'ADMIN' || u.role === 'ADMINISTRATOR';

      // Card Filter
      if (selectedFilter === 'CUSTOMER' && isAdmin) return false;
      if (selectedFilter === 'ADMIN' && !isAdmin) return false;

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const uname = (u.username || '').toLowerCase();
        const uemail = (u.email || '').toLowerCase();
        const uid = String(u.userId || u.id || '').toLowerCase();
        return uname.includes(q) || uemail.includes(q) || uid.includes(q);
      }

      return true;
    });
  }, [usersList, selectedFilter, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleCardClick = (card) => {
    setSelectedFilter(card.filterKey);
    setCurrentPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Page Title & Description Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          User Management
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          Manage all registered customers and administrators.
        </p>
      </div>

      {/* 2. Top 4 Summary Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const isActive = selectedFilter === card.filterKey;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              style={{
                backgroundColor: '#1E293B',
                border: isActive ? `2px solid ${card.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
                boxShadow: isActive ? `0 8px 25px ${card.color}30` : '0 4px 20px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#273549';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = `${card.color}60`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#1E293B';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} color={card.color} />
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: card.color,
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  border: `1px solid ${card.color}40`
                }}>
                  {card.count}
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                  {card.subtitle}
                </div>
              </div>

              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '3px',
                  backgroundColor: card.color
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Registered Users Responsive Table Container */}
      <div style={{
        backgroundColor: '#1E293B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Table Header & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Registered Users Table
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Showing {filteredUsers.length} of {usersList.length} user accounts
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{
                  width: '100%',
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '6px 12px 6px 34px',
                  color: '#FFF',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Users Directory Table */}
        {paginatedUsers.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8' }}>
            <User size={40} color="#64748B" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>No Users Found</div>
            <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Try adjusting your search query or role filter.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 14px' }}>User ID</th>
                  <th style={{ padding: '12px 14px' }}>Profile Photo</th>
                  <th style={{ padding: '12px 14px' }}>Full Name</th>
                  <th style={{ padding: '12px 14px' }}>Email</th>
                  <th style={{ padding: '12px 14px' }}>Phone</th>
                  <th style={{ padding: '12px 14px' }}>Role</th>
                  <th style={{ padding: '12px 14px' }}>Registration Date</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px' }}>Last Login</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => {
                  const uId = u.userId || u.id;
                  const displayId = `USR-${String(uId).padStart(4, '0')}`;
                  const isAdminRole = u.role === 'ADMIN' || u.role === 'ADMINISTRATOR';
                  const initial = (u.username || 'U').charAt(0).toUpperCase();

                  return (
                    <tr 
                      key={uId} 
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '14px', fontWeight: 700, color: '#3B82F6' }}>{displayId}</td>
                      <td style={{ padding: '14px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: isAdminRole ? 'rgba(167, 139, 250, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          border: isAdminRole ? '1px solid #A78BFA' : '1px solid #3B82F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isAdminRole ? '#A78BFA' : '#3B82F6',
                          fontWeight: 800,
                          fontSize: '0.88rem'
                        }}>
                          {initial}
                        </div>
                      </td>
                      <td style={{ padding: '14px', fontWeight: 600, color: '#FFFFFF' }}>{u.username}</td>
                      <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.8rem' }}>{u.email}</td>
                      <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.8rem' }}>{u.phone || '+91 98765 43210'}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: isAdminRole ? 'rgba(167, 139, 250, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: isAdminRole ? '#A78BFA' : '#10B981',
                          border: isAdminRole ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          {isAdminRole ? 'ADMINISTRATOR' : 'CUSTOMER'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.78rem' }}>{u.registrationDate || '01 Jan 2026'}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          Active
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.78rem' }}>{u.lastLogin || 'Today, 10:30 AM'}</td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setViewingUserDetail(u)}
                            style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.12)',
                              border: '1px solid rgba(59, 130, 246, 0.35)',
                              color: '#3B82F6',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="View User Details"
                          >
                            <Eye size={13} />
                            <span>View Details</span>
                          </button>

                          <button
                            onClick={() => {
                              if (setEditUserTarget) setEditUserTarget(u);
                              if (setEditUserForm) setEditUserForm({ username: u.username || '', email: u.email || '', password: '', role: u.role || 'CUSTOMER' });
                              if (onActionClick) onActionClick('modify_user');
                            }}
                            style={{
                              backgroundColor: 'rgba(245, 158, 11, 0.12)',
                              border: '1px solid rgba(245, 158, 11, 0.35)',
                              color: '#F59E0B',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Edit User Role/Details"
                          >
                            <Edit3 size={13} />
                            <span>Edit User</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Page {currentPage} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: currentPage === 1 ? '#64748B' : '#FFF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: currentPage === totalPages ? '#64748B' : '#FFF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. User View Details Modal */}
      {viewingUserDetail && (
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
            maxWidth: '560px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  User Profile: {viewingUserDetail.username}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#3B82F6', fontWeight: 700 }}>
                  USR-{String(viewingUserDetail.userId || viewingUserDetail.id).padStart(4, '0')}
                </span>
              </div>
              <button onClick={() => setViewingUserDetail(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  border: '2px solid #3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3B82F6',
                  fontWeight: 900,
                  fontSize: '1.3rem'
                }}>
                  {(viewingUserDetail.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF' }}>{viewingUserDetail.username}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>{viewingUserDetail.email}</div>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    backgroundColor: viewingUserDetail.role === 'ADMIN' ? 'rgba(167, 139, 250, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: viewingUserDetail.role === 'ADMIN' ? '#A78BFA' : '#10B981',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 700
                  }}>
                    {viewingUserDetail.role || 'CUSTOMER'}
                  </span>
                </div>
              </div>

              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3B82F6', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
                  Account Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.84rem' }}>
                  <div>Phone Number: <strong style={{ color: '#FFF' }}>{viewingUserDetail.phone || '+91 98765 43210'}</strong></div>
                  <div>Account Status: <strong style={{ color: '#10B981' }}>Active</strong></div>
                  <div>Registration Date: <strong style={{ color: '#FFF' }}>01 Jan 2026</strong></div>
                  <div>Last Active Login: <strong style={{ color: '#FFF' }}>Today, 10:30 AM</strong></div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setViewingUserDetail(null)} style={{ backgroundColor: '#3B82F6', border: 'none', color: '#FFF', padding: '8px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
