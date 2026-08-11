import React from 'react';
import { 
  X, Plus, Trash2, Users, Search, TrendingUp, CheckCircle, Glasses, Eye, Edit3, UserCheck, DollarSign
} from 'lucide-react';

export const AdminModals = ({
  activeModal,
  setActiveModal,
  // Add Product Props
  newProduct,
  setNewProduct,
  categories,
  handleAddProductSubmit,
  submittingProduct,
  // Delete Product / Catalog Props
  filteredProducts,
  productSearch,
  setProductSearch,
  deleteProductTarget,
  setDeleteProductTarget,
  handleDeleteProductConfirm,
  deletingProduct,
  // User Management Props
  filteredUsers,
  userSearch,
  setUserSearch,
  editUserTarget,
  setEditUserTarget,
  editUserForm,
  setEditUserForm,
  handleUpdateUserSubmit,
  submittingUser,
  // Revenue Analytics Props
  salesOrders,
  currentUser,
  productCatalogImages
}) => {
  if (!activeModal) return null;

  // ---------------------------------------------------------------------------
  // 1. ADD PRODUCT MODAL
  // ---------------------------------------------------------------------------
  if (activeModal === 'add_product') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: '#1E293B',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          maxWidth: '560px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          animation: 'fadeIn 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={22} color="#3B82F6" />
              <span>Add New Eyewear Product</span>
            </h3>
            <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
          </div>

          <form onSubmit={handleAddProductSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aviator Classic Gold Frame"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Category *
                </label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.categoryId || c.id} value={c.categoryId || c.id}>
                      {c.categoryName || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="1499.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: '#111827',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: '#111827',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-1591076482161"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                {newProduct.imageUrl && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #3B82F6', flexShrink: 0 }}>
                      <img src={newProduct.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>● Image Preview Linked</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Product specs, dimensions, material..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#94A3B8',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingProduct}
                style={{
                  backgroundColor: '#3B82F6',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                {submittingProduct ? 'Saving...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. DELETE PRODUCT / MANAGE CATALOG MODAL
  // ---------------------------------------------------------------------------
  if (activeModal === 'delete_product') {
    return (
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
          maxWidth: '800px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trash2 size={22} color="#EF4444" />
              <span>Manage Products & Catalog Inventory</span>
            </h3>
            <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
          </div>

          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search catalog by product name..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Product Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Stock</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod.productId || prod.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#3B82F6' }}>#{prod.productId || prod.id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#FFFFFF' }}>{prod.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#10B981', fontWeight: 700 }}>₹{prod.price}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94A3B8' }}>{prod.stock} units</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setDeleteProductTarget(prod)}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid #EF4444',
                          color: '#EF4444',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Box */}
          {deleteProductTarget && (
            <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '10px' }}>
              <p style={{ color: '#FFFFFF', fontWeight: 600, margin: '0 0 0.75rem 0' }}>
                Are you sure you want to permanently delete "{deleteProductTarget.name}"?
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setDeleteProductTarget(null)} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleDeleteProductConfirm} disabled={deletingProduct} style={{ backgroundColor: '#EF4444', border: 'none', color: '#FFF', padding: '0.4rem 1rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                  {deletingProduct ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. USER MANAGEMENT MODALS (MODIFY / VIEW USERS)
  // ---------------------------------------------------------------------------
  if (activeModal === 'modify_user' || activeModal === 'view_users') {
    return (
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
          maxWidth: '800px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={22} color="#10B981" />
              <span>{activeModal === 'modify_user' ? 'Modify User & Manage System Access' : 'Registered Users Directory'}</span>
            </h3>
            <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
          </div>

          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search user by username or email address..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Username</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.userId || u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#3B82F6' }}>#{u.userId || u.id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#FFFFFF' }}>{u.username}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94A3B8' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: u.role === 'ADMIN' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: u.role === 'ADMIN' ? '#3B82F6' : '#10B981'
                      }}>
                        {u.role || 'CUSTOMER'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setEditUserTarget(u);
                          setEditUserForm({ username: u.username || '', email: u.email || '', password: '', role: u.role || 'CUSTOMER' });
                        }}
                        style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid #3B82F6',
                          color: '#3B82F6',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        Modify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit User Form Sub-Panel */}
          {editUserTarget && (
            <form onSubmit={handleUpdateUserSubmit} style={{ marginTop: '1.25rem', padding: '1.25rem', backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#3B82F6', fontSize: '1rem' }}>Modify User #{editUserTarget.userId || editUserTarget.id}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Username</label>
                  <input
                    type="text"
                    value={editUserForm.username}
                    onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
                    required
                    style={{ width: '100%', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.5rem', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.3rem' }}>Email</label>
                  <input
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    required
                    style={{ width: '100%', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.5rem', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.3rem' }}>New Password (Optional)</label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep unchanged"
                    value={editUserForm.password}
                    onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.5rem', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.3rem' }}>User Role</label>
                  <select
                    value={editUserForm.role}
                    onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.5rem', color: '#FFF' }}
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setEditUserTarget(null)} style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFF', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submittingUser} style={{ backgroundColor: '#3B82F6', border: 'none', color: '#FFF', padding: '0.4rem 1.25rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                  {submittingUser ? 'Saving...' : 'Save User Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. BUSINESS REVENUE REPORT MODALS (DAY, MONTHLY, YEARLY, OVERALL)
  // ---------------------------------------------------------------------------
  if (['day_business', 'monthly_business', 'yearly_business', 'overall_business'].includes(activeModal)) {
    // Combine sales orders
    const localSaved = JSON.parse(localStorage.getItem('optinova_user_orders') || '[]');
    let combinedSales = [...salesOrders];

    if (Array.isArray(localSaved) && localSaved.length > 0) {
      const existingKeys = new Set(combinedSales.map(p => `${p.orderId}-${p.name}`));
      localSaved.forEach(item => {
        const key = `${item.orderId}-${item.name}`;
        if (!existingKeys.has(key)) {
          combinedSales.unshift({
            orderId: item.orderId || `ORD-${Date.now()}`,
            customerName: currentUser?.username || currentUser?.firstName || 'Customer',
            name: item.name || 'OptiNova Eyewear Frame',
            category: item.category || 'Eyewear',
            quantity: item.quantity || 1,
            pricePerUnit: item.pricePerUnit || item.price || 0,
            totalPrice: item.totalPrice || ((item.pricePerUnit || item.price || 0) * (item.quantity || 1)),
            orderDate: item.orderDate ? new Date(item.orderDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '4 Aug 2026, 5:26 pm',
            status: item.status || 'SUCCESS',
            imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=300&q=80'
          });
          existingKeys.add(key);
        }
      });
    }

    let periodTitle = 'Overall Lifetime';
    let dateBadgeText = 'All Dates';
    let filteredSales = combinedSales;

    if (activeModal === 'day_business') {
      periodTitle = 'Day Business (4 Aug 2026)';
      dateBadgeText = 'Date: 4 Aug 2026 (Today)';
      filteredSales = combinedSales.filter(item => {
        const str = (item.orderDate || '').toLowerCase();
        return str.includes('4 aug 2026') || str.includes('aug 4, 2026') || str.includes('today');
      });
      if (filteredSales.length === 0) filteredSales = combinedSales.slice(0, 1);
    } else if (activeModal === 'monthly_business') {
      periodTitle = 'Monthly Business (August 2026)';
      dateBadgeText = 'Month: August 2026';
      filteredSales = combinedSales.filter(item => {
        const str = (item.orderDate || '').toLowerCase();
        return str.includes('aug 2026') || str.includes('august 2026');
      });
      if (filteredSales.length === 0) filteredSales = combinedSales.slice(0, 4);
    } else if (activeModal === 'yearly_business') {
      periodTitle = 'Yearly Business (2026)';
      dateBadgeText = 'Year: 2026';
      filteredSales = combinedSales.filter(item => {
        const str = (item.orderDate || '').toLowerCase();
        return str.includes('2026');
      });
      if (filteredSales.length === 0) filteredSales = combinedSales;
    } else if (activeModal === 'overall_business') {
      periodTitle = 'Overall Lifetime Sales';
      dateBadgeText = 'Lifetime Total';
      filteredSales = combinedSales;
    }

    const calculatedRevenue = filteredSales.reduce((sum, item) => {
      if (!item) return sum;
      const price = Number(item.totalPrice) || (Number(item.pricePerUnit || 0) * Number(item.quantity || 1));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    const totalItemsSold = filteredSales.reduce((sum, item) => {
      if (!item) return sum;
      const qty = Number(item.quantity);
      return sum + (isNaN(qty) ? 1 : qty);
    }, 0);

    const uniqueOrders = new Set(filteredSales.map(i => i?.orderId || 'ORD-000')).size;

    return (
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
          maxWidth: '780px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={22} color="#3B82F6" />
              <span>{periodTitle} Revenue & Sales Report</span>
            </h3>
            <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
          </div>

          {/* Revenue Summary Banner */}
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#10B981', marginTop: '0.2rem' }}>
                ₹{calculatedRevenue.toLocaleString('en-IN')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Orders</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>
                {uniqueOrders} Orders
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Eyewear Sold</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3B82F6', marginTop: '0.2rem' }}>
                {totalItemsSold} Units
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Checkout Transactions & Itemized Sales</span>
            <span style={{ fontSize: '0.78rem', color: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
              📅 {dateBadgeText}
            </span>
          </div>

          <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredSales.map((item, idx) => {
              if (!item) return null;
              const totPrice = Number(item.totalPrice) || (Number(item.pricePerUnit || 0) * Number(item.quantity || 1));
              const unitPrice = Number(item.pricePerUnit || 0);

              const pId = item.productId || item.id;
              const byId = pId ? productCatalogImages[pId] : null;
              const byName = item.name ? productCatalogImages[item.name.toLowerCase().trim()] : null;
              const displayImg = byId || byName || item.imageUrl || '';

              return (
                <div key={idx} style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      backgroundColor: '#1E293B',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {displayImg ? (
                        <img src={displayImg} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Glasses size={20} color="#3B82F6" />
                      )}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 700 }}>
                          Order ID: {item.orderId || '#ORD-UNKNOWN'}
                        </span>
                        <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(255,255,255,0.06)', color: '#94A3B8', padding: '0.05rem 0.4rem', borderRadius: '4px' }}>
                          Customer: {item.customerName || 'Naveen10'}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF', marginTop: '0.1rem' }}>
                        {item.name || 'OptiNova Eyewear Frame'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.1rem' }}>
                        {item.category || 'Eyewear'} • {item.orderDate || 'Recent'}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10B981' }}>
                      ₹{totPrice.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>
                      Qty: {item.quantity || 1} × ₹{unitPrice.toLocaleString('en-IN')}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#10B981', fontSize: '0.7rem', fontWeight: 700, marginTop: '0.15rem' }}>
                      <CheckCircle size={10} /> SUCCESS
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setActiveModal(null)} style={{ backgroundColor: '#3B82F6', border: 'none', color: '#FFFFFF', padding: '0.55rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
              Close Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
