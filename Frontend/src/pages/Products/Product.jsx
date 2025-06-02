import React, { useState, useEffect, useRef } from "react";
import { AiOutlineShoppingCart, AiOutlineHeart, AiFillHeart, AiOutlineCloseCircle } from "react-icons/ai";
import { BsEye, BsStarFill, BsStar, BsGrid3X3Gap, BsList, BsFilter } from "react-icons/bs";
import { FiSearch, FiChevronDown, FiTruck, FiShield, FiAward } from "react-icons/fi";
import { MdSort, MdViewModule, MdViewList, MdZoomIn, MdVerified } from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";
import Homeproduct from "../../components/HomeProduct/HomeProducts";
import QuickView from "../../components/QuickView/QuickView"; // Import komponen QuickView
import Notification from "../../utils/Notification/Notification";
import { useNotification } from "../../hook/useNotification";
import "./Product.css";

const Product = ({
  product,
  setProduct,
  detail,
  view,
  close,
  setClose,
  addtocart,
}) => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const { notifications, showNotification, removeNotification } = useNotification();
  
  // Enhanced state management
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null); // State untuk QuickView
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false); // State untuk kontrol QuickView modal
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });
  
  const filterRef = useRef(null);
  
  // Categories with counts
  const categories = [
    { name: "All Products", count: Homeproduct.length },
    { name: "Vivo", count: Homeproduct.filter(p => p.Cat === "Vivo").length },
    { name: "Iphone", count: Homeproduct.filter(p => p.Cat === "Iphone").length },
    { name: "Samsung", count: Homeproduct.filter(p => p.Cat === "Samsung").length },
    { name: "Zfold", count: Homeproduct.filter(p => p.Cat === "Zfold").length },
    { name: "Oppo", count: Homeproduct.filter(p => p.Cat === "Oppo").length },
    { name: "Huawei", count: Homeproduct.filter(p => p.Cat === "Huawei").length },
  ];

  const handleAddToCart = (product) => {
    addtocart(product);
    showNotification('success', `🛒 ${product.Title} berhasil ditambahkan ke keranjang!`, 3000);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        showNotification('info', '💔 Dihapus dari favorit', 2000);
      } else {
        newFavorites.add(productId);
        showNotification('success', '❤️ Ditambahkan ke favorit!', 2000);
      }
      return newFavorites;
    });
  };

  // Handler untuk membuka QuickView
  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  // Handler untuk menutup QuickView
  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Handler untuk QuickView add to cart
  const handleQuickViewAddToCart = (productWithDetails) => {
    // productWithDetails berisi product, quantity, dan variant
    const { quantity = 1, ...productData } = productWithDetails;
    
    // Add to cart sebanyak quantity yang dipilih
    for (let i = 0; i < quantity; i++) {
      addtocart(productData);
    }
    
    showNotification('success', `🛒 ${quantity}x ${productData.Title} berhasil ditambahkan ke keranjang!`, 3000);
  };

  const filtterproduct = (category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setCurrentPage(1);
    
    setTimeout(() => {
      if (category === "All Products") {
        setProduct(Homeproduct);
      } else {
        const filtered = Homeproduct.filter((x) => x.Cat === category);
        setProduct(filtered);
      }
      setIsLoading(false);
    }, 300);
  };
  
  const AllProducts = () => {
    setSelectedCategory("All Products");
    setProduct(Homeproduct);
    setCurrentPage(1);
  };

  // Enhanced search with suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 0) {
      const suggestions = Homeproduct
        .filter(p => p.Title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
        .map(p => p.Title);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Enhanced brand filter
  const toggleBrand = (brand) => {
    setSelectedBrands(prev => {
      const newBrands = new Set(prev);
      if (newBrands.has(brand)) {
        newBrands.delete(brand);
      } else {
        newBrands.add(brand);
      }
      return newBrands;
    });
  };

  // Enhanced filtering and sorting
  const getFilteredProducts = () => {
    let filtered = [...product];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.Cat.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Price range filter
    filtered = filtered.filter(p => {
      const price = parseFloat(p.Price);
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Brand filter
    if (selectedBrands.size > 0) {
      filtered = filtered.filter(p => selectedBrands.has(p.Cat));
    }
    
    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.Price) - parseFloat(b.Price);
        case "price-high":
          return parseFloat(b.Price) - parseFloat(a.Price);
        case "name":
          return a.Title.localeCompare(b.Title);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={i} className="star filled" />);
    }
    if (hasHalfStar) {
      stars.push(<BsStar key="half" className="star half" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<BsStar key={i} className="star empty" />);
    }
    return stars;
  };

  // Enhanced ProductCard with QuickView integration
  const ProductCard = ({ product, index }) => {
    const [isCardHovered, setIsCardHovered] = useState(false);
    const isFavorite = favorites.has(product.id);
    
    return (
      <div 
        className={`product-card-modern ${viewMode === 'list' ? 'list-view' : ''} ${isCardHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="product-image-wrapper">
          <div className="product-image-container">
            <img 
              src={product.Img} 
              alt={product.Title}
              className="product-image"
              loading="lazy"
            />
            
            {/* Enhanced Product Badges */}
            <div className="product-badges">
              {Math.random() > 0.7 && <span className="badge badge-sale">-20%</span>}
              {Math.random() > 0.8 && <span className="badge badge-new">New</span>}
              {Math.random() > 0.9 && <span className="badge badge-hot">🔥 Hot</span>}
            </div>
            
            {/* Enhanced Product Actions */}
            <div className="product-actions-overlay">
              <button 
                className="action-btn"
                onClick={() => handleAddToCart(product)}
                title="Add to Cart"
              >
                <AiOutlineShoppingCart />
              </button>
              <button 
                className="action-btn quick-view-btn"
                onClick={() => handleQuickView(product)}
                title="Quick View"
              >
                <MdZoomIn />
              </button>
              <button 
                className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => toggleFavorite(product.id)}
                title="Add to Favorites"
              >
                {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
            </div>
            
            {/* Enhanced Quick View Overlay */}
            <div className="quick-view-overlay">
              <button 
                className="quick-view-button"
                onClick={() => handleQuickView(product)}
              >
                <BsEye /> Quick View
              </button>
            </div>
          </div>
        </div>
        
        <div className="product-content">
          <div className="product-category-tag">{product.Cat}</div>
          <h3 className="product-title">{product.Title}</h3>
          <div className="product-rating">
            <div className="rating-stars">{renderStars()}</div>
            <span className="rating-text">(4.5 • {Math.floor(Math.random() * 200) + 50})</span>
          </div>
          <div className="product-price-section">
            <span className="current-price">${product.Price}</span>
            <span className="original-price">${(parseFloat(product.Price) * 1.2).toFixed(0)}</span>
            <span className="discount-tag">20% OFF</span>
          </div>
          {viewMode === 'list' && (
            <div className="product-description">
              Experience cutting-edge technology with premium features and exceptional performance.
            </div>
          )}
        </div>
      </div>
    );
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="products-loading">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="product-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line medium"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Pagination Component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="pagination-modern">
        <button 
          className="pagination-btn prev"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button 
              className="pagination-number"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`pagination-number ${currentPage === number ? 'active' : ''}`}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button 
              className="pagination-number"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button 
          className="pagination-btn next"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={() => removeNotification(notification.id)}
          duration={notification.duration}
        />
      ))}

      {/* QuickView Component Integration */}
      <QuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        onAddToCart={handleQuickViewAddToCart}
        onToggleFavorite={toggleFavorite}
        isFavorite={quickViewProduct ? favorites.has(quickViewProduct.id) : false}
      />

      {/* Enhanced Product Detail Modal */}
      {close && (
        <div className="product-detail-modal-enhanced">
          <div className="modal-backdrop" onClick={() => setClose(false)}></div>
          <div className="modal-content-enhanced">
            <button onClick={() => setClose(false)} className="modal-close-enhanced">
              <AiOutlineCloseCircle />
            </button>
            {detail.map((product) => (
              <div className="product-detail-enhanced" key={product.id}>
                <div className="detail-image-section">
                  <div className="main-image">
                    <img src={product.Img} alt={product.Title} />
                    <div className="image-zoom-indicator">🔍 Click to zoom</div>
                  </div>
                  <div className="thumbnail-images">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={product.Img} alt={`View ${i}`} className="thumbnail" />
                    ))}
                  </div>
                </div>
                <div className="detail-info-section">
                  <div className="product-breadcrumb">
                    Home / Products / {product.Cat} / {product.Title}
                  </div>
                  <div className="product-category-badge">{product.Cat}</div>
                  <h1 className="product-title-enhanced">{product.Title}</h1>
                  <div className="product-rating-enhanced">
                    <div className="stars">{renderStars()}</div>
                    <span className="rating-text">(4.5 stars • 128 reviews)</span>
                    <a href="#reviews" className="view-reviews">View all reviews</a>
                  </div>
                  <div className="product-price-enhanced">
                    <span className="current-price">${product.Price}</span>
                    <span className="original-price">${(parseFloat(product.Price) * 1.2).toFixed(0)}</span>
                    <span className="discount-badge">Save 20%</span>
                  </div>
                  <div className="product-features-enhanced">
                    <div className="feature-item">
                      <FiTruck className="feature-icon" />
                      <div>
                        <strong>Free Shipping</strong>
                        <p>On orders over $100</p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <FiShield className="feature-icon" />
                      <div>
                        <strong>2 Year Warranty</strong>
                        <p>Full coverage included</p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <FiAward className="feature-icon" />
                      <div>
                        <strong>Premium Quality</strong>
                        <p>Certified authentic</p>
                      </div>
                    </div>
                  </div>
                  <div className="product-description-enhanced">
                    <h3>Product Description</h3>
                    <p>
                      Experience cutting-edge technology with this premium device. Features advanced processors, 
                      stunning display quality, and professional-grade camera systems for the ultimate user experience. 
                      Built with premium materials and designed for durability and performance.
                    </p>
                    <ul>
                      <li>Advanced processor technology</li>
                      <li>High-resolution display</li>
                      <li>Professional camera system</li>
                      <li>Long-lasting battery life</li>
                      <li>Premium build quality</li>
                    </ul>
                  </div>
                  <div className="product-actions-enhanced">
                    <div className="quantity-selector">
                      <label>Quantity:</label>
                      <div className="quantity-controls">
                        <button>-</button>
                        <span>1</span>
                        <button>+</button>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button 
                        className="btn-add-to-cart-enhanced"
                        onClick={() => handleAddToCart(product)}
                      >
                        <AiOutlineShoppingCart /> Add To Cart
                      </button>
                      <button 
                        className={`btn-favorite-enhanced ${favorites.has(product.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(product.id)}
                      >
                        {favorites.has(product.id) ? <AiFillHeart /> : <AiOutlineHeart />}
                        {favorites.has(product.id) ? 'Favorited' : 'Add to Favorites'}
                      </button>
                    </div>
                  </div>
                  <div className="product-guarantee">
                    <div className="guarantee-item">
                      <span className="guarantee-icon">✅</span>
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="guarantee-item">
                      <span className="guarantee-icon">🚚</span>
                      <span>Free shipping & returns</span>
                    </div>
                    <div className="guarantee-item">
                      <span className="guarantee-icon">🔒</span>
                      <span>Secure payment processing</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Products Page */}
      <div className="products-page-enhanced">
        {/* Header Section */}
        <div className="products-header">
          <div className="header-content">
            <h1 className="page-title">🛍️ Our Products</h1>
            <p className="page-subtitle">Discover amazing products with the best quality and prices</p>
            <div className="breadcrumb">
              <span>Home</span> <span className="separator">•</span> <span>Products</span>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="search-filter-bar-modern">
          <div className="search-section-enhanced">
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for products, brands, categories..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="search-input-modern"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => {
                    setSearchTerm('');
                    setShowSuggestions(false);
                  }}
                >
                  ×
                </button>
              )}
              
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchTerm(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      <FiSearch className="suggestion-icon" />
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="filter-controls-modern">
            <div className="sort-control">
              <MdSort className="sort-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select-modern"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            
            <div className="view-toggle-modern">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <BsGrid3X3Gap />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <BsList />
              </button>
            </div>
            
            <button 
              className="filter-toggle-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <BsFilter /> Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="products-main-content">
          {/* Enhanced Sidebar */}
          <div className={`products-sidebar-modern ${isFilterOpen ? 'open' : ''}`} ref={filterRef}>
            <div className="sidebar-header">
              <h3 className="sidebar-title">
                <BsFilter className="title-icon" />
                Filters
              </h3>
              <button 
                className="close-sidebar-btn"
                onClick={() => setIsFilterOpen(false)}
              >
              </button>
            </div>
            
            {/* Enhanced Categories Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Categories</h4>
              <div className="category-grid">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
                    onClick={() => filtterproduct(category.name)}
                  >
                    <div className="category-info">
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">{category.count}</span>
                    </div>
                    <div className="category-icon">📱</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Enhanced Price Range Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Price Range</h4>
              <div className="price-range-modern">
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceFilter.min}
                    onChange={(e) => setPriceFilter({...priceFilter, min: parseInt(e.target.value) || 0})}
                    className="price-input"
                  />
                  <span className="price-separator">-</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="price-slider-modern"
                />
                <div className="price-display">
                  <span className="price-label">${priceRange[0]}</span>
                  <span className="price-label">${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="filter-actions">
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm("");
                  setPriceRange([0, 10000]);
                  setPriceFilter({ min: 0, max: 10000 });
                  setSelectedBrands(new Set());
                }}
              >
                Clear All Filters
              </button>
              <button 
                className="apply-filters-btn"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Main Product Content Area */}
          <div className="products-content-area">
            {/* Products Grid / List */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className={`products-grid-modern ${viewMode === 'list' ? 'list-view' : ''}`}>
                {currentProducts.length > 0 ? (
                  currentProducts.map((curElm, index) => (
                    <ProductCard product={curElm} key={curElm.id || index} index={index} />
                  ))
                ) : (
                  <div className="no-products-found">
                    <h3>No Products Found</h3>
                    <p>Try adjusting your filters or search term.</p>
                  </div>
                )}
              </div>
            )}
            <Pagination />
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;