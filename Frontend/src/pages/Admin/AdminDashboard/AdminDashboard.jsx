import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

// Import default products - ganti dengan path yang benar
// Sesuaikan path ini dengan struktur direktori Anda
import defaultProducts from '../../../components/HomeProduct/HomeProducts';

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalPurchase: 0,
    lastUpdated: null
  });
  const [activities, setActivities] = useState([]);

  // Product Management States
  const [showProductModal, setShowProductModal] = useState(false);
  const [productModalMode, setProductModalMode] = useState('add'); // 'add' or 'edit'
  const [currentProduct, setCurrentProduct] = useState({
    id: '',
    Title: '',
    Cat: '',
    Price: '',
    Img: ''
  });
  const [productSearchTerm, setProductSearchTerm] = useState('');

  useEffect(() => {
    // Load data from localStorage
    loadOrdersData();
    loadStatsData();
    loadProductsData();
    generateActivities();
  }, []);

  const loadOrdersData = () => {
    try {
      const adminOrders = JSON.parse(localStorage.getItem("adminOrders") || "[]");
      setOrders(adminOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const loadStatsData = () => {
    try {
      const adminStats = JSON.parse(localStorage.getItem("adminStats") || "{}");
      setStats({
        totalRevenue: adminStats.totalRevenue || 45230,
        totalSales: adminStats.totalSales || 1250,
        totalPurchase: adminStats.totalPurchase || 89,
        lastUpdated: adminStats.lastUpdated
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadProductsData = () => {
    try {
      const savedProducts = JSON.parse(localStorage.getItem("adminProducts") || "[]");
      if (savedProducts.length === 0) {
        // Jika tidak ada produk tersimpan, gunakan data default
        setProducts(defaultProducts);
        localStorage.setItem("adminProducts", JSON.stringify(defaultProducts));
      } else {
        setProducts(savedProducts);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts(defaultProducts);
    }
  };

  const saveProductsData = (productsData) => {
    try {
      localStorage.setItem("adminProducts", JSON.stringify(productsData));
    } catch (error) {
      console.error("Error saving products:", error);
    }
  };

  const generateActivities = () => {
    const recentActivities = [
      {
        id: 1,
        action: "New order received",
        meta: "2 minutes ago",
        icon: "📦"
      },
      {
        id: 2,
        action: "Payment confirmed",
        meta: "5 minutes ago",
        icon: "💳"
      },
      {
        id: 3,
        action: "Order shipped",
        meta: "1 hour ago",
        icon: "🚚"
      },
      {
        id: 4,
        action: "Customer registered",
        meta: "2 hours ago",
        icon: "👤"
      },
      {
        id: 5,
        action: "Product updated",
        meta: "3 hours ago",
        icon: "📱"
      }
    ];
    setActivities(recentActivities);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const refreshData = () => {
    loadOrdersData();
    loadStatsData();
    loadProductsData();
    generateActivities();
  };

  const exportData = () => {
    const dataToExport = {
      orders,
      products,
      stats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Product Management Functions
  const openProductModal = (mode, product = null) => {
    setProductModalMode(mode);
    if (mode === 'edit' && product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct({
        id: '',
        Title: '',
        Cat: '',
        Price: '',
        Img: ''
      });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setCurrentProduct({
      id: '',
      Title: '',
      Cat: '',
      Price: '',
      Img: ''
    });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    if (productModalMode === 'add') {
      // Generate new ID
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      const newProduct = {
        ...currentProduct,
        id: newId,
        Price: currentProduct.Price.toString()
      };
      
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      saveProductsData(updatedProducts);
    } else if (productModalMode === 'edit') {
      const updatedProducts = products.map(product => 
        product.id === currentProduct.id 
          ? { ...currentProduct, Price: currentProduct.Price.toString() }
          : product
      );
      
      setProducts(updatedProducts);
      saveProductsData(updatedProducts);
    }
    
    closeProductModal();
  };

  const deleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      saveProductsData(updatedProducts);
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredOrders = orders.filter(order =>
    order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone?.includes(searchTerm) ||
    order.id?.toString().includes(searchTerm)
  );

  const filteredProducts = products.filter(product =>
    product.Title?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.Cat?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.id?.toString().includes(productSearchTerm)
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      let date;
      
      if (!dateString) {
        return 'No Date';
      }
      
      // Parse berbagai format tanggal
      if (dateString.includes('T') || dateString.includes('/') || !isNaN(Date.parse(dateString))) {
        date = new Date(dateString);
      } else {
        date = new Date(dateString);
      }
      
      // Cek apakah tanggal valid
      if (isNaN(date.getTime())) {
        return dateString; // Return string asli jika tidak bisa diparse
      }
      
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'shipped':
        return 'status-shipped';
      case 'pending':
      default:
        return 'status-pending';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: null },
    { id: 'orders', label: 'Orders', icon: '📦', badge: orders.length },
    { id: 'customers', label: 'Customers', icon: '👥', badge: null },
    { id: 'products', label: 'Products', icon: '📱', badge: products.length },
    { id: 'analytics', label: 'Analytics', icon: '📈', badge: null },
    { id: 'settings', label: 'Settings', icon: '⚙️', badge: null }
  ];

  const categories = ['Iphone', 'Samsung', 'Huawei', 'Oppo', 'Vivo', 'Zfold'];

  return (
    <div className={`admin-dashboard ${darkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'} ${darkMode ? 'dark' : 'light'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">HP</div>
            {!sidebarCollapsed && (
              <div className="logo-text">
                <h2>HP Store</h2>
                <p>Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu1">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''} ${darkMode ? 'dark' : 'light'}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="dark-mode-toggle">
          <button
            className={`dark-mode-btn ${darkMode ? 'dark' : 'light'}`}
            onClick={toggleDarkMode}
          >
            <span className="nav-icon">{darkMode ? '☀️' : '🌙'}</span>
            {!sidebarCollapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          className={`sidebar-toggle ${darkMode ? 'dark' : 'light'}`}
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'collapsed' : 'expanded'}`}>
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'customers' && 'Customer Management'}
              {activeTab === 'products' && 'Product Management'}
              {activeTab === 'analytics' && 'Analytics & Reports'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="page-subtitle">
              {activeTab === 'dashboard' && 'Welcome back! Here\'s what\'s happening with your store today.'}
              {activeTab === 'orders' && `Manage your ${orders.length} orders and track their status.`}
              {activeTab === 'customers' && 'View and manage your customer database.'}
              {activeTab === 'products' && `Manage your ${products.length} products inventory and catalog.`}
              {activeTab === 'analytics' && 'Detailed insights and performance metrics.'}
              {activeTab === 'settings' && 'Configure your store settings and preferences.'}
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={refreshData}>
              🔄 Refresh Data
            </button>
            <button className="btn-primary btn-secondary" onClick={exportData}>
              📊 Export Data
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className={`stat-card ${darkMode ? 'dark' : 'light'}`}>
                <div className="stat-header">
                  <div 
                    className="stat-icon"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}
                  >
                    💰
                  </div>
                  <div className="stat-change positive">+12.5%</div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{formatCurrency(stats.totalRevenue)}</h3>
                  <p className="stat-title">Total Revenue</p>
                  <p className="stat-desc">Last 30 days</p>
                </div>
              </div>

              <div className={`stat-card ${darkMode ? 'dark' : 'light'}`}>
                <div className="stat-header">
                  <div 
                    className="stat-icon"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}
                  >
                    📦
                  </div>
                  <div className="stat-change positive">+8.2%</div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.totalSales.toLocaleString()}</h3>
                  <p className="stat-title">Total Sales</p>
                  <p className="stat-desc">Products sold</p>
                </div>
              </div>

              <div className={`stat-card ${darkMode ? 'dark' : 'light'}`}>
                <div className="stat-header">
                  <div 
                    className="stat-icon"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}
                  >
                    🛒
                  </div>
                  <div className="stat-change live">Live</div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.totalPurchase}</h3>
                  <p className="stat-title">Total Orders</p>
                  <p className="stat-desc">All time</p>
                </div>
              </div>

              <div className={`stat-card ${darkMode ? 'dark' : 'light'}`}>
                <div className="stat-header">
                  <div 
                    className="stat-icon"
                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}
                  >
                    👥
                  </div>
                  <div className="stat-change positive">+15.3%</div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{orders.length}</h3>
                  <p className="stat-title">Active Customers</p>
                  <p className="stat-desc">This month</p>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="content-grid three-col">
              {/* Recent Orders */}
              <div className={`card ${darkMode ? 'dark' : 'light'}`}>
                <div className="card-header">
                  <h3 className="card-title">Recent Orders</h3>
                </div>
                <div className="activity-list">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className={`activity-item ${darkMode ? 'dark' : 'light'}`}>
                      <img 
                        src={order.avatar}
                        alt={order.name}
                        className="customer-avatar"
                      />
                      <div className="activity-content">
                        <p className="activity-action">
                          {order.name} - {formatCurrency(order.total)}
                        </p>
                        <p className="activity-meta">
                          {formatDate(order.date)} • {order.paymentMethod}
                        </p>
                      </div>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className={`card ${darkMode ? 'dark' : 'light'}`}>
                <div className="card-header">
                  <h3 className="card-title">Recent Activity</h3>
                </div>
                <div className="activity-list">
                  {activities.map((activity) => (
                    <div key={activity.id} className={`activity-item ${darkMode ? 'dark' : 'light'}`}>
                      <div className="activity-icon">
                        {activity.icon}
                      </div>
                      <div className="activity-content">
                        <p className="activity-action">{activity.action}</p>
                        <p className="activity-meta">{activity.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {/* Search */}
            <div className="content-grid">
              <div className={`card ${darkMode ? 'dark' : 'light'}`}>
                <div className="card-header">
                  <h3 className="card-title">Order Management</h3>
                  <input
                    type="text"
                    placeholder="Search orders by name, phone, or ID..."
                    className={`search-input ${darkMode ? 'dark' : 'light'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Orders Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead className={`table-header ${darkMode ? 'dark' : 'light'}`}>
                      <tr>
                        <th>Customer</th>
                        <th>Order ID</th>
                        <th>Item</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className={`table-row ${darkMode ? 'dark' : 'light'}`}>
                          <td className="table-cell">
                            <div className="customer-info">
                              <img
                                src={order.avatar}
                                alt={order.name}
                                className="customer-avatar"
                              />
                              <div>
                                <p className="customer-name">{order.name}</p>
                                <p className="customer-phone">{order.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="table-cell">#{order.id}</td>
                          <td className="table-cell">
                            {order.items?.length || 0} 
                          </td>
                          <td className="table-cell">
                            <span className="amount">{formatCurrency(order.total)}</span>
                          </td>
                          <td className="table-cell">{order.paymentMethod}</td>
                          <td className="table-cell">{formatDate(order.date)}</td>
                          <td className="table-cell">
                            <span className={`status-badge ${getStatusColor(order.status)}`}>
                              {order.status || 'Completed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredOrders.length === 0 && (
                    <div className="coming-soon">
                      <div>
                        <div className="coming-soon-icon">📦</div>
                        <h3>No Orders Found</h3>
                        <p>
                          {searchTerm 
                            ? `No orders match "${searchTerm}"`
                            : "No orders available yet."
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            <div className="content-grid">
              <div className={`card ${darkMode ? 'dark' : 'light'}`}>
                <div className="card-header">
                  <div className="card-header-left">
                    <h3 className="card-title">Product Management</h3>
                    <input
                      type="text"
                      placeholder="Search products by name, category, or ID..."
                      className={`search-input ${darkMode ? 'dark' : 'light'}`}
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={() => openProductModal('add')}
                  >
                    ➕ Add Product
                  </button>
                </div>

                {/* Products Grid */}
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className={`product-card ${darkMode ? 'dark' : 'light'}`}>
                      <div className="product-image">
                        <img 
                          src={product.Img} 
                          alt={product.Title}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <h4 className="product-title">{product.Title}</h4>
                        <div className="product-meta">
                          <span className="product-category">{product.Cat}</span>
                          <span className="product-price">{formatCurrency(product.Price)}</span>
                        </div>
                        <div className={`product-id ${darkMode ? 'dark' : 'light'}`}>ID: #{product.id}</div>
                      </div>
                      <div className="product-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => openProductModal('edit', product)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => deleteProduct(product.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="coming-soon">
                    <div>
                      <div className="coming-soon-icon">📱</div>
                      <h3>No Products Found</h3>
                      <p>
                        {productSearchTerm 
                          ? `No products match "${productSearchTerm}"`
                          : "No products available yet."
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Other Tabs - Coming Soon */}
        {['customers', 'analytics', 'settings'].includes(activeTab) && (
          <div className={`card ${darkMode ? 'dark' : 'light'}`}>
            <div className="coming-soon">
              <div>
                <div className="coming-soon-icon">🚧</div>
                <h3>Coming Soon</h3>
                <p>This feature is under development and will be available soon.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className={`modal ${darkMode ? 'dark' : 'light'}`}>
            <div className="modal-header">
              <h3>{productModalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
              <button className="modal-close" onClick={closeProductModal}>×</button>
            </div>
            <form onSubmit={handleProductSubmit} className="modal-body">
              <div className="form-group">
                <label>Product Title</label>
                <textarea
                  name="Title"
                  value={currentProduct.Title}
                  onChange={handleProductInputChange}
                  placeholder="Enter product title"
                  required
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="Cat"
                  value={currentProduct.Cat}
                  onChange={handleProductInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price (USD)</label>
                <input
                  type="number"
                  name="Price"
                  value={currentProduct.Price}
                  onChange={handleProductInputChange}
                  placeholder="Enter price"
                  required
                  min="0"
                  step="1"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="Img"
                  value={currentProduct.Img}
                  onChange={handleProductInputChange}
                  placeholder="Enter image URL"
                  required
                />
              </div>
              {currentProduct.Img && (
                <div className="image-preview">
                  <img src={currentProduct.Img} alt="Preview" />
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeProductModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {productModalMode === 'add' ? 'Add Product' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;