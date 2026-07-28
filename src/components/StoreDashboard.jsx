import React, { useState } from 'react';
import { 
  Glasses, ShoppingBag, Search, Filter, Sparkles, LogOut, 
  User, Check, Eye, Star, ShieldCheck, Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StoreDashboard = ({ onOpenVirtualTryOn }) => {
  const { currentUser, logoutUser, addToast } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(2);

  const categories = ['All', 'Sunglasses', 'Prescription', 'Blue-Light', 'Luxury Line'];

  const products = [
    {
      id: 1,
      name: 'OptiNova Aviator Titanium Gold',
      category: 'Sunglasses',
      price: '$285',
      badge: 'Bestseller',
      rating: 4.9,
      iconColor: '#D4AF37'
    },
    {
      id: 2,
      name: 'Stellar Blue-Light Shield',
      category: 'Blue-Light',
      price: '$165',
      badge: 'Popular',
      rating: 4.8,
      iconColor: '#38BDF8'
    },
    {
      id: 3,
      name: 'Monaco Handcrafted Acetate',
      category: 'Luxury Line',
      price: '$420',
      badge: 'Limited Edition',
      rating: 5.0,
      iconColor: '#FB7185'
    },
    {
      id: 4,
      name: 'OptiClear HD Prescription Frames',
      category: 'Prescription',
      price: '$210',
      badge: 'Medical Grade',
      rating: 4.9,
      iconColor: '#34D399'
    },
    {
      id: 5,
      name: 'Vanguard Polarized Sport',
      category: 'Sunglasses',
      price: '$240',
      badge: 'UV400 Shield',
      rating: 4.7,
      iconColor: '#F59E0B'
    },
    {
      id: 6,
      name: 'Lumina Minimalist Rimless',
      category: 'Prescription',
      price: '$310',
      badge: 'Ultralight 8g',
      rating: 4.9,
      iconColor: '#A855F7'
    }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    addToast(`Added "${product.name}" to your cart!`, 'success');
  };

  return (
    <div className="dashboard-container">
      {/* Top Banner Header */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#D4AF37', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <Sparkles size={16} />
            <span>EXCLUSIVE MEMBER CATALOG</span>
          </div>

          <h1 className="dashboard-hero-title">
            Welcome, {currentUser?.firstName || 'Member'}
          </h1>
          <p className="dashboard-hero-desc">
            Discover German engineered precision optics, handcrafted Japanese titanium, and custom anti-reflection coatings.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }} onClick={onOpenVirtualTryOn}>
              <Camera size={18} />
              3D Virtual Try-On
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="brand-icon-box" style={{ width: 120, height: 120, borderRadius: 24 }}>
            <Glasses size={64} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="category-tabs" style={{ marginBottom: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-dim)' }} size={18} />
          <input
            type="text"
            className="form-input"
            placeholder="Search eyewear..."
            style={{ paddingLeft: 42 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-box">
              <span className="product-badge">{product.badge}</span>
              <Glasses size={80} color={product.iconColor} strokeWidth={1.2} />
            </div>

            <div className="product-category">{product.category}</div>
            <h3 className="product-title">{product.name}</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: '#F59E0B', marginBottom: '0.75rem' }}>
              <Star size={14} fill="#F59E0B" />
              <span>{product.rating} (120+ Reviews)</span>
            </div>

            <div className="product-price-row">
              <div className="product-price">{product.price}</div>
              <button 
                className="add-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingBag size={15} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
