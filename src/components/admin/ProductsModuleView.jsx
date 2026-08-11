import React, { useState, useMemo } from 'react';
import { Package, Plus, Eye, AlertTriangle, Glasses, Search, Filter, ChevronLeft, ChevronRight, Edit3, Trash2, X, Check, Tag, ShieldCheck, Layers } from 'lucide-react';

export const ProductsModuleView = ({
  products = [],
  categories = [],
  productCatalogImages = {},
  onActionClick,
  setDeleteProductTarget
}) => {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewingProductDetail, setViewingProductDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Helper to extract category name from ANY product object or categories list
  const getCategoryName = (prod, cats) => {
    if (!prod) return '';

    // Direct string property on product
    if (typeof prod.categoryName === 'string' && prod.categoryName.trim()) {
      return prod.categoryName.trim();
    }
    if (typeof prod.category === 'string' && prod.category.trim()) {
      return prod.category.trim();
    }
    if (typeof prod.productCategory === 'string' && prod.productCategory.trim()) {
      return prod.productCategory.trim();
    }
    if (typeof prod.type === 'string' && prod.type.trim()) {
      return prod.type.trim();
    }

    // Object property on product (e.g. prod.category = { categoryId: 1, categoryName: "Reading Glass" })
    if (prod.category && typeof prod.category === 'object') {
      const nameFromObj = prod.category.categoryName || prod.category.name || prod.category.title;
      if (typeof nameFromObj === 'string' && nameFromObj.trim()) {
        return nameFromObj.trim();
      }
    }

    // Match prod.categoryId in categories array
    const catId = prod.categoryId != null ? prod.categoryId : (prod.category && typeof prod.category === 'object' ? (prod.category.categoryId || prod.category.id) : null);
    if (catId != null && Array.isArray(cats)) {
      const matchedCat = cats.find(c => String(c.categoryId || c.id) === String(catId));
      if (matchedCat) {
        const nameFromCatList = matchedCat.categoryName || matchedCat.name || matchedCat.title;
        if (typeof nameFromCatList === 'string' && nameFromCatList.trim()) {
          return nameFromCatList.trim();
        }
      }
    }

    return '';
  };

  // Robust category matching function
  const matchCategory = (selectedCat, prodCatName) => {
    if (!selectedCat || selectedCat.toUpperCase() === 'ALL' || selectedCat.toLowerCase() === 'all categories') {
      return true; // "All Categories" matches ALL products
    }

    if (!prodCatName) return false;

    const target = selectedCat.toLowerCase().trim();
    const prod = prodCatName.toLowerCase().trim();

    // Exact case-insensitive match
    if (target === prod) return true;

    // Singular/plural & formatting normalization
    const normTarget = target.replace(/glasses$/, 'glass').replace(/s$/, '');
    const normProd = prod.replace(/glasses$/, 'glass').replace(/s$/, '');

    if (normTarget === normProd) return true;

    // Substring fallback
    if (target.includes(normProd) || prod.includes(normTarget)) return true;

    return false;
  };

  // Build unified dropdown options including default categories & dynamic categories
  const categoryOptions = useMemo(() => {
    const defaultOptions = [
      'Digital Glass',
      'Luxury Glasses',
      'Prescription Glasses',
      'Reading Glass',
      'Sports Glasses',
      'Sunglasses'
    ];

    const set = new Set(defaultOptions);

    (categories || []).forEach(c => {
      const name = c.categoryName || c.name || c.title;
      if (name && typeof name === 'string' && name.trim()) {
        set.add(name.trim());
      }
    });

    (products || []).forEach(p => {
      const catName = getCategoryName(p, categories);
      if (catName && typeof catName === 'string' && catName.trim()) {
        set.add(catName.trim());
      }
    });

    return Array.from(set);
  }, [categories, products]);

  // Stock Metrics
  const totalProducts = products.length;
  const inStockCount = useMemo(() => products.filter(p => (p.stock || 0) > 0).length, [products]);
  const lowStockCount = useMemo(() => products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length, [products]);

  // 4 Top Summary Cards Specification
  const summaryCards = [
    {
      id: 'total_products',
      filterKey: 'ALL',
      title: 'Total Products',
      subtitle: 'All catalog listings',
      icon: Package,
      count: totalProducts,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.15)'
    },
    {
      id: 'add_product',
      filterKey: 'ADD',
      title: 'Add Product',
      subtitle: 'Create new frame listing',
      icon: Plus,
      count: '+ NEW',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.15)',
      isAction: true,
      actionType: 'add_product'
    },
    {
      id: 'view_products',
      filterKey: 'IN_STOCK',
      title: 'View Products',
      subtitle: 'In-stock active items',
      icon: Eye,
      count: inStockCount,
      color: '#A78BFA',
      bg: 'rgba(167, 139, 250, 0.15)'
    },
    {
      id: 'low_stock',
      filterKey: 'LOW_STOCK',
      title: 'Low Stock',
      subtitle: 'Inventory < 10 units',
      icon: AlertTriangle,
      count: lowStockCount,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.15)'
    }
  ];

  // Robust Filtering Logic (Category Filter + Search Filter in Tandem)
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const stock = prod.stock || 0;
      const prodCatName = getCategoryName(prod, categories);

      // Card Summary Filter
      if (selectedFilter === 'IN_STOCK' && stock <= 0) return false;
      if (selectedFilter === 'LOW_STOCK' && (stock <= 0 || stock >= 10)) return false;

      // 1. Category Dropdown Filter
      if (!matchCategory(selectedCategory, prodCatName)) {
        return false;
      }

      // 2. Search Query Filter (applied across category-filtered items)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const pName = (prod.name || '').toLowerCase();
        const pId = String(prod.productId || prod.id || '').toLowerCase();
        const pBrand = (prod.brand || 'OptiNova').toLowerCase();
        const pDesc = (prod.description || '').toLowerCase();
        const cName = prodCatName.toLowerCase();

        return (
          pName.includes(q) ||
          pId.includes(q) ||
          pBrand.includes(q) ||
          pDesc.includes(q) ||
          cName.includes(q)
        );
      }

      return true;
    });
  }, [products, selectedFilter, selectedCategory, searchQuery, categories]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleCardClick = (card) => {
    if (card.isAction && onActionClick) {
      onActionClick(card.actionType);
    } else {
      setSelectedFilter(card.filterKey);
      setCurrentPage(1);
    }
  };

  const getProductImage = (prod) => {
    const pId = prod.productId || prod.id;
    const byId = pId ? productCatalogImages[pId] : null;
    const byName = prod.name ? productCatalogImages[prod.name.toLowerCase().trim()] : null;
    return byId || byName || (prod.imageUrls && prod.imageUrls[0]) || prod.imageUrl || '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Page Title & Description Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          Product Management
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          Manage all eyewear products available in the OptiNova store.
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

      {/* 3. Live Products Responsive Table Container */}
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
              Live Products Table
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search products..."
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

            {/* Category Filter Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              style={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#FFF',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Categories</option>
              {categoryOptions.map(catOpt => (
                <option key={catOpt} value={catOpt}>
                  {catOpt}
                </option>
              ))}
            </select>

            {/* Add Product Shortcut Button */}
            <button
              onClick={() => onActionClick && onActionClick('add_product')}
              style={{
                backgroundColor: '#3B82F6',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Products Table */}
        {paginatedProducts.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8' }}>
            <Glasses size={40} color="#64748B" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>No Products Found</div>
            <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Try adjusting your search query or filters.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 14px' }}>Product ID</th>
                  <th style={{ padding: '12px 14px' }}>Product Image</th>
                  <th style={{ padding: '12px 14px' }}>Product Name</th>
                  <th style={{ padding: '12px 14px' }}>Category</th>
                  <th style={{ padding: '12px 14px' }}>Brand</th>
                  <th style={{ padding: '12px 14px' }}>Frame Type</th>
                  <th style={{ padding: '12px 14px' }}>Lens Type</th>
                  <th style={{ padding: '12px 14px' }}>Stock</th>
                  <th style={{ padding: '12px 14px' }}>Price</th>
                  <th style={{ padding: '12px 14px' }}>Discount</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((prod) => {
                  const pId = prod.productId || prod.id;
                  const displayId = `PRD-${String(pId).padStart(3, '0')}`;
                  const img = getProductImage(prod);
                  const categoryName = getCategoryName(prod, categories) || 'Eyewear';
                  const stock = prod.stock || 0;
                  const isLowStock = stock > 0 && stock < 10;
                  const isOutOfStock = stock <= 0;

                  return (
                    <tr 
                      key={pId} 
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '14px', fontWeight: 700, color: '#3B82F6' }}>{displayId}</td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#111827', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {img ? <img src={img} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Glasses size={20} color="#3B82F6" />}
                        </div>
                      </td>
                      <td style={{ padding: '14px', fontWeight: 600, color: '#FFFFFF' }}>{prod.name}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ backgroundColor: 'rgba(167, 139, 250, 0.15)', color: '#A78BFA', border: '1px solid rgba(167, 139, 250, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {categoryName}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.8rem' }}>{prod.brand || 'OptiNova'}</td>
                      <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.8rem' }}>{prod.frameType || 'Full Rim'}</td>
                      <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.8rem' }}>{prod.lensType || 'Blue Cut'}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          color: isOutOfStock ? '#EF4444' : isLowStock ? '#F59E0B' : '#10B981',
                          backgroundColor: isOutOfStock ? 'rgba(239, 68, 68, 0.15)' : isLowStock ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {stock} units
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontWeight: 800, color: '#10B981' }}>₹{Number(prod.price || 0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '14px', color: '#94A3B8', fontSize: '0.8rem' }}>{prod.discount ? `${prod.discount}%` : '0%'}</td>
                      <td style={{ padding: '14px' }}>
                        {isOutOfStock ? (
                          <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 9px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Out of Stock</span>
                        ) : isLowStock ? (
                          <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 9px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Low Stock</span>
                        ) : (
                          <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 9px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Active</span>
                        )}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setViewingProductDetail(prod)}
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
                            title="View Product Details"
                          >
                            <Eye size={13} />
                            <span>View Details</span>
                          </button>

                          <button
                            onClick={() => onActionClick && onActionClick('edit_product')}
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
                            title="Edit Product Details"
                          >
                            <Edit3 size={13} />
                            <span>Edit Product</span>
                          </button>

                          <button
                            onClick={() => setDeleteProductTarget && setDeleteProductTarget(prod)}
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              color: '#EF4444',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                            <span>Delete Product</span>
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

      {/* 4. Product View Details Modal */}
      {viewingProductDetail && (
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
            maxWidth: '600px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Product Details: {viewingProductDetail.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#3B82F6', fontWeight: 700 }}>
                  PRD-{String(viewingProductDetail.productId || viewingProductDetail.id).padStart(3, '0')}
                </span>
              </div>
              <button onClick={() => setViewingProductDetail(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '20px', backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ width: '110px', height: '110px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getProductImage(viewingProductDetail) ? (
                    <img src={getProductImage(viewingProductDetail)} alt={viewingProductDetail.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Glasses size={40} color="#3B82F6" />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.86rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{viewingProductDetail.name}</div>
                  <div style={{ color: '#10B981', fontWeight: 800, fontSize: '1.1rem' }}>₹{Number(viewingProductDetail.price || 0).toLocaleString('en-IN')}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Brand: <strong style={{ color: '#FFF' }}>{viewingProductDetail.brand || 'OptiNova Premium'}</strong></div>
                  <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Stock Inventory: <strong style={{ color: viewingProductDetail.stock > 0 ? '#10B981' : '#EF4444' }}>{viewingProductDetail.stock || 0} units</strong></div>
                </div>
              </div>

              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3B82F6', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
                  Technical Specifications
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.84rem' }}>
                  <div>Frame Type: <strong style={{ color: '#FFF' }}>{viewingProductDetail.frameType || 'Full Rim'}</strong></div>
                  <div>Lens Coating: <strong style={{ color: '#FFF' }}>{viewingProductDetail.lensType || 'Blue Cut Protection'}</strong></div>
                  <div>Gender / Fit: <strong style={{ color: '#FFF' }}>Unisex Universal Fit</strong></div>
                  <div>Material: <strong style={{ color: '#FFF' }}>TR90 Lightweight Acetate</strong></div>
                </div>
              </div>

              <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A78BFA', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                  Description
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
                  {viewingProductDetail.description || 'Premium optical frame designed for maximum durability, scratch-resistant clarity, and computer blue light protection.'}
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setViewingProductDetail(null)} style={{ backgroundColor: '#3B82F6', border: 'none', color: '#FFF', padding: '8px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
