import React, { useState, useEffect, useRef } from "react";
import { AiOutlineShoppingCart, AiOutlineHeart, AiFillHeart, AiOutlineCloseCircle } from "react-icons/ai";
import { BsEye, BsStarFill, BsStar, BsGrid3X3Gap, BsList, BsFilter } from "react-icons/bs";
import { FiSearch, FiChevronDown, FiTruck, FiShield, FiAward } from "react-icons/fi";
import { MdSort, MdViewModule, MdViewList, MdZoomIn, MdVerified } from "react-icons/md";
import Homeproduct from "../../components/HomeProduct/HomeProducts";
import QuickView from "../../components/QuickView/QuickView";
import Notification from "../../utils/Notification/Notification";
import { useNotification } from "../../hook/useNotification";
import "./Product.css";

// Importing images for products
import ip16Image from "../../assets/images/ip 16.jpg";
import ip13 from "../../assets/images/ip13.jpg";
import zfold from "../../assets/images/zfold.jpg";
import zfold6 from "../../assets/images/zfold6.jpg";
import huawei from "../../assets/images/huawei.jpg";
import oppo2 from "../../assets/images/oppo2.jpg";
import samsung from "../../assets/images/samsung.jpg";
import samsung3 from "../../assets/images/samsung3.jpg";
import huawei3 from "../../assets/images/huawei3.jpg";
import vivo7 from "../../assets/images/vivo7.jpg";
import vivo2 from "../../assets/images/vivo2.jpg";
import vivo4 from "../../assets/images/vivo4.jpg";
import zfold3 from "../../assets/images/zfold3.jpg";
import oppo1 from "../../assets/images/oppo1.jpg";
import oppo3 from "../../assets/images/oppo3.jpg";
import oppo4 from "../../assets/images/oppo4.jpg";
import samsung6 from "../../assets/images/samsung6.jpg";
import huawei4 from "../../assets/images/huawei4.jpg";
import samsung4 from "../../assets/images/samsung4.jpg";
import ipx from "../../assets/images/ipx.jpg";

const imageMap = {
  "ip 16.jpg": ip16Image,
  "ip 13.jpg": ip13,
  "zffold.jpg": zfold,
  "zfold6.jpg": zfold6,
  "huawei.jpg": huawei,
  "oppo2.jpg": oppo2,
  "samsung.jpg": samsung,
  "samsung3.jpg": samsung3,
  "huawei3.jpg": huawei3,
  "vivo7.jpg": vivo7,
  "vivo2.jpg": vivo2,
  "vivo4.jpg": vivo4,
  "zfold3.jpg": zfold3,
  "oppo1.jpg": oppo1,
  "oppo3.jpg": oppo3,
  "oppo4.jpg": oppo4,
  "samsung6.jpg": samsung6,
  "huawei4.jpg": huawei4,
  "samsung4.jpg": samsung4,
  "ipx.jpg": ipx
};

const Product = ({
  product,
  setProduct,
  detail,
  view,
  close,
  setClose,
  addtocart,
}) => {
  const [products, setProducts] = useState([]);
  const { notifications, showNotification, removeNotification } = useNotification();

  // Fungsi untuk menormalisasi data HomeProduct agar sesuai dengan struktur yang diharapkan
  const normalizeHomeProducts = (homeProducts) => {
    return homeProducts.map(item => ({
      id: item.id,
      name: item.Title,
      category: item.Cat,
      price: item.Price,
      image: item.Img,
      // Tambahan fields untuk kompatibilitas
      Title: item.Title,
      Cat: item.Cat,
      Price: item.Price,
      Img: item.Img
    }));
  };

  useEffect(() => {
    // Langkah 1: Set data lokal dari HomeProduct terlebih dahulu
    const normalizedHomeProducts = normalizeHomeProducts(Homeproduct);
    setProducts(normalizedHomeProducts);
    setProduct(normalizedHomeProducts);

    // Langkah 2: Coba fetch data dari backend
    fetch('http://localhost/Project-pak-Pur/Backend/api/products.php')
      .then(res => res.json())
      .then(data => {
        console.log('Backend data:', data);
        
        if (data.products && data.products.length > 0) {
          // Jika ada data dari backend, gabungkan dengan data lokal
          const backendProducts = data.products.map(item => ({
            ...item,
            // Pastikan struktur konsisten
            name: item.name || item.Title,
            category: item.category || item.Cat,
            price: item.price || item.Price,
            image: item.image || item.Img
          }));
          
          // Gabungkan data lokal dan backend (hindari duplikasi berdasarkan ID)
          const combinedProducts = [...normalizedHomeProducts];
          backendProducts.forEach(backendProduct => {
            const existingIndex = combinedProducts.findIndex(p => p.id === backendProduct.id);
            if (existingIndex === -1) {
              // Tambah produk baru dari backend
              combinedProducts.push(backendProduct);
            } else {
              // Update produk yang sudah ada
              combinedProducts[existingIndex] = { ...combinedProducts[existingIndex], ...backendProduct };
            }
          });
          
          setProducts(combinedProducts);
          setProduct(combinedProducts);
        }
        // Jika tidak ada data dari backend, tetap gunakan data lokal
      })
      .catch(error => {
        console.error('Error fetching backend data:', error);
        console.log('Using local HomeProduct data only');
        // Tetap gunakan data lokal jika backend error
      });
  }, []);

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
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });

  const filterRef = useRef(null);

  // Categories with counts
  const categories = [
    { name: "All Products", count: products.length },
    ...Array.from(
      products.reduce((acc, p) => {
        const cat = p.category || "Other";
        acc.set(cat, (acc.get(cat) || 0) + 1);
        return acc;
      }, new Map())
    ).map(([name, count]) => ({ name, count }))
  ];

  const handleAddToCart = (product) => {
    addtocart(product);
    showNotification('success', `🛒 ${product.name || product.Title} berhasil ditambahkan ke keranjang!`, 3000);
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
    const { quantity = 1, ...productData } = productWithDetails;
    
    for (let i = 0; i < quantity; i++) {
      addtocart(productData);
    }
    
    showNotification('success', `🛒 ${quantity}x ${productData.Title || productData.name} berhasil ditambahkan ke keranjang!`, 3000);
  };

  const filtterproduct = (category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setCurrentPage(1);

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const AllProducts = () => {
    setSelectedCategory("All Products");
    setCurrentPage(1);
  };

  // Enhanced search with suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const suggestions = products
        .filter(p => {
          const name = p.name || p.Title || '';
          return name.toLowerCase().includes(value.toLowerCase());
        })
        .slice(0, 5)
        .map(p => p.name || p.Title);
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
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => {
        const name = p.name || p.Title || '';
        const category = p.category || p.Cat || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               category.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Price range filter
    filtered = filtered.filter(p => {
      const price = parseFloat(p.price || p.Price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Brand/category filter
    if (selectedBrands.size > 0) {
      filtered = filtered.filter(p => selectedBrands.has(p.category || p.Cat));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price || a.Price || 0) - parseFloat(b.price || b.Price || 0);
        case "price-high":
          return parseFloat(b.price || b.Price || 0) - parseFloat(a.price || a.Price || 0);
        case "name":
          const nameA = a.name || a.Title || '';
          const nameB = b.name || b.Title || '';
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    // Category filter (sidebar)
    if (selectedCategory && selectedCategory !== "All Products") {
      filtered = filtered.filter(p => (p.category || p.Cat || "Other") === selectedCategory);
    }

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

  // Enhanced ProductCard dengan fleksibilitas struktur data
  const ProductCard = ({ product, index }) => {
    const [isCardHovered, setIsCardHovered] = useState(false);
    const isFavorite = favorites.has(product.id);
    
    // Fleksibel untuk kedua struktur data
    const productName = product.name || product.Title || 'Unnamed Product';
    const productPrice = product.price || product.Price || '0';
    const productCategory = product.category || product.Cat || 'Other';
    const productImage = product.image || product.Img;
    
    // Untuk produk dari HomeProduct, gunakan image directly, untuk backend gunakan imageMap
    let imgSrc = '';
    if (typeof productImage === 'string') {
      imgSrc = imageMap[productImage] || productImage;
    } else {
      imgSrc = productImage;
    }

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
              src={imgSrc}
              alt={productName}
              className="product-image"
              loading="lazy"
              onError={(e) => {
                console.log('Image failed to load:', imgSrc);
                e.target.src = '/placeholder-image.jpg'; // fallback image
              }}
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
                {product.Cat || product.category}
              </button>
            </div>
          </div>
        </div>
        
        <div className="product-content">
          <div className="product-category-tag">{productCategory}</div>
          <h3 className="product-title">{productName}</h3>
          <div className="product-price-section">
            <span className="current-price">${productPrice}</span>
          </div>
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
                    <img src={product.Img || product.image} alt={product.Title || product.name} />
                    <div className="image-zoom-indicator">🔍 Click to zoom</div>
                  </div>
                  <div className="thumbnail-images">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={product.Img || product.image} alt={`View ${i}`} className="thumbnail" />
                    ))}
                  </div>
                </div>
                <div className="detail-info-section">
                  <div className="product-breadcrumb">
                    Home / Products / {product.Cat || product.category} / {product.Title || product.name}
                  </div>
                  <div className="product-category-badge">{product.Cat || product.category}</div>
                  <h1 className="product-title-enhanced">{product.Title || product.name}</h1>
                  <div className="product-rating-enhanced">
                    <div className="stars">{renderStars()}</div>
                    <span className="rating-text">(4.5 stars • 128 reviews)</span>
                    <a href="#reviews" className="view-reviews">View all reviews</a>
                  </div>
                  <div className="product-price-enhanced">
                    <span className="current-price">${product.Price || product.price}</span>
                    <span className="original-price">${(parseFloat(product.Price || product.price) * 1.2).toFixed(0)}</span>
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