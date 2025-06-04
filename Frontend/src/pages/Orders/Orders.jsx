import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AiOutlineShoppingCart, 
  AiOutlineEye, 
  AiOutlineCalendar,
  AiOutlinePhone,
  AiOutlineEnvironment,
  AiOutlineCreditCard,
  AiOutlineFilter,
  AiOutlineSearch,
  AiOutlineReload
} from 'react-icons/ai';
import { BsBox, BsCheckCircle, BsClock, BsX } from 'react-icons/bs';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, sortBy]);

  const loadOrders = () => {
    setLoading(true);
    try {
      const allOrders = JSON.parse(localStorage.getItem("transaksiHP") || "[]");
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    } finally {
      setTimeout(() => setLoading(false), 500); // Simulate loading
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toString().includes(searchTerm) ||
        order.phone?.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        (order.status || 'pending').toLowerCase() === statusFilter
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date || Date.now()) - new Date(a.date || Date.now());
        case 'oldest':
          return new Date(a.date || Date.now()) - new Date(b.date || Date.now());
        case 'highest':
          return parseFloat(b.total || 0) - parseFloat(a.total || 0);
        case 'lowest':
          return parseFloat(a.total || 0) - parseFloat(b.total || 0);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <BsCheckCircle className="status-icon completed" />;
      case 'pending':
        return <BsClock className="status-icon pending" />;
      case 'processing':
        return <BsBox className="status-icon processing" />;
      case 'cancelled':
        return <BsX className="status-icon cancelled" />;
      default:
        return <BsClock className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'Selesai';
      case 'pending': return 'Menunggu';
      case 'processing': return 'Diproses';
      case 'cancelled': return 'Dibatalkan';
      default: return 'Menunggu';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('id-ID');
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalItems = (items) => {
    return items?.reduce((total, item) => total + (item.qty || 1), 0) || 0;
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner">
          <AiOutlineReload className="spin" />
        </div>
        <h2>Memuat pesanan...</h2>
      </div>
    );
  }

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
        <div className="header-content">
          <h1>
            <BsBox className="header-icon" />
            Pesanan Saya
          </h1>
          <p>Kelola dan pantau semua pesanan Anda di sini</p>
        </div>
        <Link to="/" className="back-home-btn">
          <AiOutlineShoppingCart />
          Belanja Lagi
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="orders-controls">
        <div className="search-box">
          <AiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, ID, atau telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <AiOutlineFilter className="filter-icon" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="processing">Diproses</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>

          <div className="sort-group">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="highest">Nilai Tertinggi</option>
              <option value="lowest">Nilai Terendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Stats */}
      <div className="orders-stats">
        <div className="stat-card1">
          <div className="stat-number">{orders.length}</div>
          <div className="stat-label">Total Pesanan</div>
        </div>
        <div className="stat-card1">
          <div className="stat-number">
            {orders.filter(o => (o.status || 'pending') === 'pending').length}
          </div>
          <div className="stat-label">Menunggu</div>
        </div>
        <div className="stat-card1">
          <div className="stat-number">
            {orders.filter(o => (o.status || 'pending') === 'completed').length}
          </div>
          <div className="stat-label">Selesai</div>
        </div>
        <div className="stat-card1">
          <div className="stat-number">
            ${orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0).toFixed(2)}
          </div>
          <div className="stat-label">Total Nilai</div>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-content">
        {filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <BsBox className="empty-icon" />
            <h3>Tidak ada pesanan ditemukan</h3>
            <p>
              {orders.length === 0 
                ? "Anda belum memiliki pesanan apapun" 
                : "Tidak ada pesanan yang sesuai dengan filter"
              }
            </p>
            <Link to="/" className="shop-now-btn">
              <AiOutlineShoppingCart />
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-id">
                    <span>#{order.id}</span>
                    {getStatusIcon(order.status)}
                  </div>
                  <div className={`order-status ${(order.status || 'pending').toLowerCase()}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="customer-info">
                    <h3>{order.name}</h3>
                    <div className="info-row">
                      <AiOutlinePhone className="info-icon" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="info-row">
                      <AiOutlineEnvironment className="info-icon" />
                      <span className="address-text">{order.address}</span>
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Items:</span>
                      <span>{calculateTotalItems(order.items)} produk</span>
                    </div>
                    <div className="summary-row">
                      <AiOutlineCreditCard className="payment-icon" />
                      <span className="payment-method">
                        {order.paymentMethod === 'transfer' ? 'Transfer' : 'COD'}
                      </span>
                    </div>
                    <div className="summary-row total-row">
                      <span>Total:</span>
                      <span className="total-amount">${order.total}</span>
                    </div>
                  </div>

                  <div className="order-date">
                    <AiOutlineCalendar className="date-icon" />
                    <p className="activity-meta">
                          {formatDate(order.date)} • {order.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="order-card-footer">
                  <button 
                    className="view-details-btn"
                    onClick={() => openOrderDetails(order)}
                  >
                    <AiOutlineEye />
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detail Pesanan #{selectedOrder.id}</h2>
              <button className="close-modal-btn" onClick={closeModal}>
                <BsX />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Informasi Pelanggan</h3>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <label>Nama:</label>
                    <span>{selectedOrder.name}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Telepon:</label>
                    <span>{selectedOrder.phone}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Alamat:</label>
                    <span>{selectedOrder.address}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Pembayaran:</label>
                    <span>
                      {selectedOrder.paymentMethod === 'transfer' ? 'Transfer Bank' : 'Bayar di Tempat (COD)'}
                    </span>
                  </div>
                  <div className="modal-info-item">
                    <label>Status:</label>
                    <span className={`modal-status ${(selectedOrder.status || 'pending').toLowerCase()}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Produk yang Dipesan</h3>
                <div className="modal-items-list">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="modal-item">
                      <div className="modal-item-image">
                        <img src={item.Img} alt={item.Title} />
                      </div>
                      <div className="modal-item-details">
                        <h4>{item.Title}</h4>
                        <p className="modal-item-category">{item.Cat}</p>
                        <div className="modal-item-price">
                          <span>${item.Price} x {item.qty || 1}</span>
                          <span className="modal-item-subtotal">
                            ${(item.Price * (item.qty || 1)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-total">
                  <div className="modal-total-row">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.total}</span>
                  </div>
                  <div className="modal-total-row">
                    <span>Ongkos Kirim:</span>
                    <span>Gratis</span>
                  </div>
                  <div className="modal-total-row final-total">
                    <span>Total:</span>
                    <span>${selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;