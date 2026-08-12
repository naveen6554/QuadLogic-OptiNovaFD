import React, { useState, useEffect } from 'react';
import { 
  Glasses, ShoppingBag, Search, Sparkles, Star, Camera, ChevronLeft, ChevronRight, AlertTriangle, AlertCircle, Eye, Heart 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProductDetailsModal } from './ProductDetailsModal';
import { API_BASE_URL } from '../config/apiConfig';
import heroBannerImg from '../assets/customer_hero_banner.jpg';

export const StoreDashboard = ({ onOpenVirtualTryOn }) => {
  const { currentUser, addToast, addToCart, isInWishlist, toggleWishlist } = useAuth();

  // Dynamic States
  const [categories, setCategories] = useState([{ id: null, name: 'All' }]);
  const [activeCategory, setActiveCategory] = useState({ id: null, name: 'All' });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [products, setProducts] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map(cat => ({
            id: cat.categoryId || cat.id,
            name: cat.categoryName || cat.name
          }));
          setCategories([{ id: null, name: 'All' }, ...mapped]);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch products on filter / search / pagination change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/api/v1/products?page=${pageNo}&size=${pageSize}`;

        if (activeCategory.id) {
          url = `${API_BASE_URL}/api/v1/products/category/${activeCategory.id}?page=${pageNo}&size=${pageSize}`;
        }

        if (searchQuery.trim() !== '') {
          url = `${API_BASE_URL}/api/v1/products/search?name=${encodeURIComponent(searchQuery.trim())}&page=${pageNo}&size=${pageSize}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setProducts(data.data?.content || []);
          setTotalPages(data.data?.totalPages || 0);
          setTotalElements(data.data?.totalElements || 0);
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Unable to connect to server. Please check backend status.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNo, pageSize, activeCategory, searchQuery]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setPageNo(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPageNo(0);
  };

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = async (product, e) => {
    if (e) e.stopPropagation();
    const stock = product.stockQuantity ?? product.stock ?? 0;
    if (stock <= 0) {
      addToast('This product is currently out of stock and cannot be added.', 'error');
      return;
    }
    const pId = product.id || product.productId;
    await addToCart(pId, 1, product.name);
  };

  // Helper badge generator
  const getProductBadge = (p) => {
    const stock = p.stockQuantity ?? p.stock ?? 0;
    if (stock <= 5) return 'Low Stock';
    if (p.id % 5 === 0) return 'Bestseller';
    if (p.id % 3 === 0) return 'Popular';
    if (p.id % 7 === 0) return 'Limited Edition';
    return 'Premium';
  };

  return (
    <div className="dashboard-container">
      {/* Top Shop Catalog Header Banner */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(15, 20, 32, 0.9) 0%, rgba(8, 11, 18, 0.95) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#D4AF37', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.35rem' }}>
            <Sparkles size={14} />
            <span>EXCLUSIVE MEMBER COLLECTION ({totalElements} Products Available)</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Eyewear Store & Collection
          </h2>
        </div>

        <button 
          className="btn-primary" 
          style={{ 
            width: 'auto', 
            padding: '0.75rem 1.5rem', 
            fontSize: '0.92rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '10px'
          }} 
          onClick={onOpenVirtualTryOn}
        >
          <Camera size={18} />
          <span>3D Virtual Try-On</span>
        </button>
      </div>

      {/* Categories & Search Bar */}
      <div id="catalog-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="category-tabs" style={{ marginBottom: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat.id ?? 'all'}
              className={`category-tab ${activeCategory.id === cat.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 300 }}>
          <Search style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-dim)' }} size={18} />
          <input
            type="text"
            className="form-input"
            placeholder="Search 87+ eyewear products..."
            style={{ paddingLeft: 42 }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-box">
          <div className="loading-spinner"></div>
          <p>Loading eyewear products from catalog...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="empty-state-box">
          <AlertTriangle size={36} color="var(--accent-rose)" style={{ marginBottom: '0.75rem' }} />
          <h3>Error loading products</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Empty Search / Filter State */}
      {!loading && !error && products.length === 0 && (
        <div className="empty-state-box">
          <Glasses size={48} color="var(--primary-gold)" style={{ marginBottom: '0.75rem' }} />
          <h3>No Eyewear Found</h3>
          <p>No products match your current search or category filter. Try clearing filters.</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="products-grid">
            {products.map((product) => {
              const imageUrl = (product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : null;
              const categoryName = product.category?.categoryName || product.categoryName || product.category?.name || 'Eyewear';
              const stock = product.stockQuantity ?? product.stock ?? 0;
              const formattedPrice = `₹${Number(product.price).toLocaleString('en-IN')}`;

              const isOutOfStock = stock <= 0;

              return (
                <div 
                  key={product.id || product.productId} 
                  className="product-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-image-box" style={{ position: 'relative' }}>
                    <span className="product-badge">{getProductBadge(product)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      title={isInWishlist(product.id || product.productId) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isInWishlist(product.id || product.productId) ? 'rgba(251, 113, 133, 0.25)' : 'rgba(11, 15, 25, 0.65)',
                        border: isInWishlist(product.id || product.productId) ? '1px solid #FB7185' : '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Heart 
                        size={17} 
                        color={isInWishlist(product.id || product.productId) ? '#FB7185' : '#FFF'} 
                        fill={isInWishlist(product.id || product.productId) ? '#FB7185' : 'none'} 
                      />
                    </button>
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={product.name} 
                        className="product-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div style={{ display: imageUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      <Glasses size={80} color="#D4AF37" strokeWidth={1.2} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="product-category">{categoryName}</div>
                    <div className="product-stock-info">
                      <span className={stock > 0 ? 'stock-in' : 'stock-out'}>
                        {stock > 0 ? `Stock: ${stock}` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  <h3 className="product-title">{product.name}</h3>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: '#F59E0B' }}>
                      <Star size={14} fill="#F59E0B" />
                      <span>4.8 (120+ Reviews)</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary-gold)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 500 }}>
                      <Eye size={13} /> Details
                    </span>
                  </div>

                  <div className="product-price-row">
                    <div className="product-price">{formattedPrice}</div>
                    <button 
                      className={`add-cart-btn ${isOutOfStock ? 'disabled' : ''}`}
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isOutOfStock}
                      style={isOutOfStock ? {
                        opacity: 0.6,
                        background: 'rgba(251, 113, 133, 0.15)',
                        borderColor: 'rgba(251, 113, 133, 0.4)',
                        color: 'var(--accent-rose)',
                        cursor: 'not-allowed'
                      } : {}}
                    >
                      {isOutOfStock ? (
                        <>
                          <AlertCircle size={15} />
                          Out of Stock
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={15} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <>
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={() => setPageNo((prev) => Math.max(prev - 1, 0))}
                  disabled={pageNo === 0}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                      key={idx}
                      className={`page-num-btn ${pageNo === idx ? 'active' : ''}`}
                      onClick={() => setPageNo(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => setPageNo((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={pageNo >= totalPages - 1}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="pagination-summary">
                Showing page <strong>{pageNo + 1}</strong> of <strong>{totalPages}</strong> (Total <strong>{totalElements}</strong> products in catalog)
              </div>
            </>
          )}
        </>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
