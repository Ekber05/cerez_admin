import React, { useState, useEffect, useRef } from 'react';
import './AllOrders.css';
import { useOrders } from '../../../hooks/useOrders';
import { 
  FiSearch, FiFilter, FiDownload, FiPrinter, 
  FiEye, FiEdit, FiTrash2, FiChevronLeft, 
  FiChevronRight, FiChevronsLeft, FiChevronsRight,
  FiRefreshCw, FiX, FiCheck, FiClock, FiAlertCircle,
  FiCalendar, FiDollarSign, FiUser, FiPhone,
  FiChevronDown, FiArrowLeft, FiArrowRight, 
  FiSkipBack, FiSkipForward
} from 'react-icons/fi';

const AllOrders = () => {
  // ========== STATE ==========
  const { 
    orders, 
    loading, 
    error, 
    refreshOrders, 
    updateOrder, 
    deleteOrder,
    calculateStats
  } = useOrders();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  
  const [viewModal, setViewModal] = useState({ show: false, order: null });
  const [editModal, setEditModal] = useState({ show: false, order: null, field: '' });
  const [statusModal, setStatusModal] = useState({ show: false, order: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, orderId: null });
  
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    processing: 0,
    cancelled: 0,
    totalAmount: 0
  });

  const ordersPerPage = 10;

  // ========== DROPDOWN ==========
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // ========== STATİSTİKALARI HESABLA ==========
  useEffect(() => {
    if (orders.length > 0) {
      const newStats = calculateStats();
      setStats(newStats);
    } else {
      setStats({
        total: 0,
        completed: 0,
        pending: 0,
        processing: 0,
        cancelled: 0,
        totalAmount: 0
      });
    }
  }, [orders, calculateStats]);

  // ========== FILTERLƏMƏ ==========
  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    if (dateFilter !== 'all') {
      const today = new Date();
      const todayStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
      
      if (dateFilter === 'today') {
        filtered = filtered.filter(order => order.date === todayStr);
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(order => {
          const [day, month, year] = order.date.split('.');
          const orderDate = new Date(year, month - 1, day);
          return orderDate >= weekAgo;
        });
      } else if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(order => {
          const [day, month, year] = order.date.split('.');
          const orderDate = new Date(year, month - 1, day);
          return orderDate >= monthAgo;
        });
      }
    }
    
    if (amountFilter !== 'all') {
      if (amountFilter === 'low') {
        filtered = filtered.filter(order => order.amount < 50);
      } else if (amountFilter === 'medium') {
        filtered = filtered.filter(order => order.amount >= 50 && order.amount < 100);
      } else if (amountFilter === 'high') {
        filtered = filtered.filter(order => order.amount >= 100);
      }
    }
    
    return filtered;
  };

  const filteredOrders = getFilteredOrders();
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleViewOrder = (order) => {
    setViewModal({ show: true, order });
  };

  const closeViewModal = () => {
    setViewModal({ show: false, order: null });
  };

  const handleEditOrder = (order, field) => {
    setEditModal({ 
      show: true, 
      order: { ...order }, 
      field,
      originalValue: order[field]
    });
  };

  const handleEditChange = (e) => {
    setEditModal({
      ...editModal,
      order: {
        ...editModal.order,
        [editModal.field]: e.target.value
      }
    });
  };

  const saveEdit = () => {
    updateOrder(editModal.order.id, { [editModal.field]: editModal.order[editModal.field] });
    setEditModal({ show: false, order: null, field: '' });
  };

  const closeEditModal = () => {
    setEditModal({ show: false, order: null, field: '' });
  };

  const handleStatusChange = (order) => {
    setStatusModal({ show: true, order: { ...order } });
  };

  const handleStatusSelect = (newStatus) => {
    updateOrder(statusModal.order.id, { status: newStatus });
    setStatusModal({ show: false, order: null });
  };

  const closeStatusModal = () => {
    setStatusModal({ show: false, order: null });
  };

  const handleDeleteClick = (orderId) => {
    setDeleteModal({ show: true, orderId });
  };

  const confirmDelete = () => {
    deleteOrder(deleteModal.orderId);
    
    if (currentOrders.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    
    setDeleteModal({ show: false, orderId: null });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, orderId: null });
  };

  const handleExport = () => {
    const exportData = filteredOrders.map(order => ({
      'Sifariş ID': order.id,
      'Müştəri': order.customer,
      'Telefon': order.phone,
      'Tarix': order.date,
      'Saat': order.time,
      'Məbləğ (AZN)': order.amount.toFixed(2),
      'Status': order.status === 'completed' ? 'Tamamlandı' :
                order.status === 'pending' ? 'Gözləyir' :
                order.status === 'processing' ? 'Hazırlanır' : 'Ləğv edildi',
      'Ödəniş metodu': order.paymentMethod,
      'Məhsul sayı': order.items
    }));
    
    const headers = Object.keys(exportData[0] || {}).join(',');
    const rows = exportData.map(obj => Object.values(obj).map(val => 
      typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    ).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sifarisler_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`${exportData.length} sifariş export edildi!`);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    const tableRows = filteredOrders.map(order => `
       <tr>
        <td>${order.id}</td>
        <td>${order.customer}</td>
        <td>${order.phone}</td>
        <td>${order.date}</td>
        <td>₼${order.amount.toFixed(2)}</td>
        <td>${order.status === 'completed' ? 'Tamamlandı' :
               order.status === 'pending' ? 'Gözləyir' :
               order.status === 'processing' ? 'Hazırlanır' : 'Ləğv edildi'}</td>
       </tr>
    `).join('');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Sifarişlər Siyahısı</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
            h1 { color: #333; margin-bottom: 10px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #667eea; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            .footer { margin-top: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bütün Sifarişlər</h1>
            <p>Çap tarixi: ${new Date().toLocaleDateString('az-AZ')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Sifariş ID</th>
                <th>Müştəri</th>
                <th>Telefon</th>
                <th>Tarix</th>
                <th>Məbləğ</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">
            <p>Cəmi sifariş: ${filteredOrders.length}</p>
            <p>Ümumi məbləğ: ₼${filteredOrders.reduce((sum, o) => sum + o.amount, 0).toFixed(2)}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setFilterStatus('all');
    setDateFilter('all');
    setAmountFilter('all');
    refreshOrders();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setDateFilter('all');
    setAmountFilter('all');
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="ao-status-badge ao-status-completed">Tamamlandı</span>;
      case 'pending':
        return <span className="ao-status-badge ao-status-pending">Gözləyir</span>;
      case 'processing':
        return <span className="ao-status-badge ao-status-processing">Hazırlanır</span>;
      case 'cancelled':
        return <span className="ao-status-badge ao-status-cancelled">Ləğv edildi</span>;
      default:
        return <span className="ao-status-badge">{status}</span>;
    }
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'all': return 'Bütün statuslar';
      case 'completed': return 'Tamamlanmış';
      case 'pending': return 'Gözləyən';
      case 'processing': return 'Hazırlanır';
      case 'cancelled': return 'Ləğv edilmiş';
      default: return 'Status';
    }
  };

  const getDateLabel = (date) => {
    switch(date) {
      case 'all': return 'Bütün tarixlər';
      case 'today': return 'Bugün';
      case 'week': return 'Son 7 gün';
      case 'month': return 'Son 30 gün';
      default: return 'Tarix';
    }
  };

  const getAmountLabel = (amount) => {
    switch(amount) {
      case 'all': return 'Bütün məbləğlər';
      case 'low': return '50 AZN -dən az';
      case 'medium': return '50 - 100 AZN';
      case 'high': return '100 AZN -dən çox';
      default: return 'Məbləğ';
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="ao-container">
        <div className="ao-loading-container">
          <div className="ao-loading-spinner"></div>
          <p>Sifarişlər yüklənir...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ao-container">
        <div className="ao-error-container">
          <p>{error}</p>
          <button onClick={handleRefresh}>Yenidən cəhd edin</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ao-container">
      {/* Başlıq və əməliyyatlar */}
      <div className="ao-header">
        <div>
          <h1 className="ao-page-title">Bütün Sifarişlər</h1>
          <p className="ao-orders-count">Cəmi {stats.total} sifariş</p>
        </div>
        <div className="ao-header-actions">
          <button className="ao-action-btn ao-refresh-btn" onClick={handleRefresh} title="Yenilə">
            <FiRefreshCw /> Yenilə
          </button>
          <button className="ao-action-btn ao-export-btn" onClick={handleExport}>
            <FiDownload /> Export
          </button>
          <button className="ao-action-btn ao-print-btn" onClick={handlePrint}>
            <FiPrinter /> Çap et
          </button>
        </div>
      </div>

      {/* FILTERLER */}
      <div className="ao-compact-filters" ref={dropdownRef}>
        <div className="ao-search-wrapper">
          <FiSearch className="ao-search-icon" />
          <input
            type="text"
            placeholder="Axtarış (ID, müştəri, telefon...)"
            value={searchTerm}
            onChange={handleSearch}
            className="ao-search-input"
          />
          {searchTerm && (
            <FiX className="ao-clear-search" onClick={() => setSearchTerm('')} />
          )}
        </div>

        <div className="ao-filter-buttons">
          <div className="ao-filter-dropdown">
            <button 
              className={`ao-filter-btn ${filterStatus !== 'all' ? 'ao-active' : ''}`}
              onClick={() => toggleDropdown('status')}
            >
              <FiFilter />
              <span>{getStatusLabel(filterStatus)}</span>
              <FiChevronDown className={`ao-dropdown-arrow ${openDropdown === 'status' ? 'ao-open' : ''}`} />
            </button>
            {openDropdown === 'status' && (
              <div className="ao-dropdown-menu">
                <div 
                  className={`ao-dropdown-item ${filterStatus === 'all' ? 'ao-selected' : ''}`}
                  onClick={() => { setFilterStatus('all'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Bütün statuslar
                </div>
                <div 
                  className={`ao-dropdown-item ${filterStatus === 'completed' ? 'ao-selected' : ''}`}
                  onClick={() => { setFilterStatus('completed'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Tamamlanmış
                </div>
                <div 
                  className={`ao-dropdown-item ${filterStatus === 'processing' ? 'ao-selected' : ''}`}
                  onClick={() => { setFilterStatus('processing'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Hazırlanır
                </div>
                <div 
                  className={`ao-dropdown-item ${filterStatus === 'pending' ? 'ao-selected' : ''}`}
                  onClick={() => { setFilterStatus('pending'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Gözləyən
                </div>
                <div 
                  className={`ao-dropdown-item ${filterStatus === 'cancelled' ? 'ao-selected' : ''}`}
                  onClick={() => { setFilterStatus('cancelled'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Ləğv edilmiş
                </div>
              </div>
            )}
          </div>

          <div className="ao-filter-dropdown">
            <button 
              className={`ao-filter-btn ${dateFilter !== 'all' ? 'ao-active' : ''}`}
              onClick={() => toggleDropdown('date')}
            >
              <FiCalendar />
              <span>{getDateLabel(dateFilter)}</span>
              <FiChevronDown className={`ao-dropdown-arrow ${openDropdown === 'date' ? 'ao-open' : ''}`} />
            </button>
            {openDropdown === 'date' && (
              <div className="ao-dropdown-menu">
                <div 
                  className={`ao-dropdown-item ${dateFilter === 'all' ? 'ao-selected' : ''}`}
                  onClick={() => { setDateFilter('all'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Bütün tarixlər
                </div>
                <div 
                  className={`ao-dropdown-item ${dateFilter === 'today' ? 'ao-selected' : ''}`}
                  onClick={() => { setDateFilter('today'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Bugün
                </div>
                <div 
                  className={`ao-dropdown-item ${dateFilter === 'week' ? 'ao-selected' : ''}`}
                  onClick={() => { setDateFilter('week'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Son 7 gün
                </div>
                <div 
                  className={`ao-dropdown-item ${dateFilter === 'month' ? 'ao-selected' : ''}`}
                  onClick={() => { setDateFilter('month'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Son 30 gün
                </div>
              </div>
            )}
          </div>

          <div className="ao-filter-dropdown">
            <button 
              className={`ao-filter-btn ${amountFilter !== 'all' ? 'ao-active' : ''}`}
              onClick={() => toggleDropdown('amount')}
            >
              <FiDollarSign />
              <span>{getAmountLabel(amountFilter)}</span>
              <FiChevronDown className={`ao-dropdown-arrow ${openDropdown === 'amount' ? 'ao-open' : ''}`} />
            </button>
            {openDropdown === 'amount' && (
              <div className="ao-dropdown-menu">
                <div 
                  className={`ao-dropdown-item ${amountFilter === 'all' ? 'ao-selected' : ''}`}
                  onClick={() => { setAmountFilter('all'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Bütün məbləğlər
                </div>
                <div 
                  className={`ao-dropdown-item ${amountFilter === 'low' ? 'ao-selected' : ''}`}
                  onClick={() => { setAmountFilter('low'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  50 AZN -dən az
                </div>
                <div 
                  className={`ao-dropdown-item ${amountFilter === 'medium' ? 'ao-selected' : ''}`}
                  onClick={() => { setAmountFilter('medium'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  50 - 100 AZN
                </div>
                <div 
                  className={`ao-dropdown-item ${amountFilter === 'high' ? 'ao-selected' : ''}`}
                  onClick={() => { setAmountFilter('high'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  100 AZN -dən çox
                </div>
              </div>
            )}
          </div>

          {(searchTerm || filterStatus !== 'all' || dateFilter !== 'all' || amountFilter !== 'all') && (
            <button className="ao-filter-btn ao-clear-all-btn" onClick={clearFilters}>
              <FiX /> Təmizlə
            </button>
          )}
        </div>

        {(searchTerm || filterStatus !== 'all' || dateFilter !== 'all' || amountFilter !== 'all') && (
          <div className="ao-compact-active-filters">
            {searchTerm && (
              <span className="ao-compact-active-filter">
                "{searchTerm}"
                <FiX onClick={() => setSearchTerm('')} />
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="ao-compact-active-filter">
                {filterStatus === 'completed' ? 'Tamamlanmış' :
                 filterStatus === 'pending' ? 'Gözləyən' :
                 filterStatus === 'processing' ? 'Hazırlanır' : 'Ləğv edilmiş'}
                <FiX onClick={() => setFilterStatus('all')} />
              </span>
            )}
            {dateFilter !== 'all' && (
              <span className="ao-compact-active-filter">
                {dateFilter === 'today' ? 'Bugün' :
                 dateFilter === 'week' ? 'Son 7 gün' : 'Son 30 gün'}
                <FiX onClick={() => setDateFilter('all')} />
              </span>
            )}
            {amountFilter !== 'all' && (
              <span className="ao-compact-active-filter">
                {amountFilter === 'low' ? '< 50₼' :
                 amountFilter === 'medium' ? '50-100₼' : '> 100₼'}
                <FiX onClick={() => setAmountFilter('all')} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* STATISTIKA KARTLARI */}
      <div className="ao-stats-cards">
        <div className="ao-stat-card">
          <span className="ao-stat-label">Ümumi sifariş</span>
          <span className="ao-stat-value">{stats.total}</span>
        </div>
        <div className="ao-stat-card">
          <span className="ao-stat-label">Tamamlanmış</span>
          <span className="ao-stat-value">{stats.completed}</span>
        </div>
        <div className="ao-stat-card">
          <span className="ao-stat-label">Hazırlanır</span>
          <span className="ao-stat-value">{stats.processing}</span>
        </div>
        <div className="ao-stat-card">
          <span className="ao-stat-label">Gözləyən</span>
          <span className="ao-stat-value">{stats.pending}</span>
        </div>
        <div className="ao-stat-card">
          <span className="ao-stat-label">Ləğv edilmiş</span>
          <span className="ao-stat-value">{stats.cancelled}</span>
        </div>
        <div className="ao-stat-card">
          <span className="ao-stat-label">Ümumi məbləğ</span>
          <span className="ao-stat-value">₼{stats.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Nəticə sayı */}
      <div className="ao-results-info">
        <p>Cəmi <strong>{filteredOrders.length}</strong> sifariş tapıldı</p>
      </div>

      {/* Sifarişlər cədvəli */}
      <div className="ao-table-wrapper">
        {filteredOrders.length === 0 ? (
          <div className="ao-no-data">
            <p>Heç bir sifariş tapılmadı</p>
            <button className="ao-clear-filters-btn" onClick={clearFilters}>Filtrləri təmizlə</button>
          </div>
        ) : (
          <table className="ao-table">
            <thead>
              <tr>
                <th>Sifariş ID</th>
                <th>Müştəri</th>
                <th>Telefon</th>
                <th>Tarix</th>
                <th>Məbləğ</th>
                <th>Status</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="ao-order-id">{order.id}</td>
                  <td className="ao-customer-name">{order.customer}</td>
                  <td className="ao-customer-phone">{order.phone}</td>
                  <td>
                    <div className="ao-date-info">
                      <span>{order.date}</span>
                      <small>{order.time}</small>
                    </div>
                  </td>
                  <td className="ao-order-amount">₼{order.amount.toFixed(2)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div className="ao-action-buttons">
                      <button 
                        className="ao-action-btn ao-view-btn" 
                        onClick={() => handleViewOrder(order)}
                        title="Bax"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="ao-action-btn ao-edit-btn" 
                        onClick={() => handleEditOrder(order, 'customer')}
                        title="Redaktə et"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="ao-action-btn ao-status-btn" 
                        onClick={() => handleStatusChange(order)}
                        title="Status dəyiş"
                      >
                        <FiFilter />
                      </button>
                      <button 
                        className="ao-action-btn ao-delete-btn" 
                        onClick={() => handleDeleteClick(order.id)}
                        title="Sil"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ao-pagination">
          <button 
            onClick={() => goToPage(1)} 
            disabled={currentPage === 1}
            className="ao-pagination-btn ao-first-page"
            title="İlk səhifə"
          >
            <FiChevronsLeft />
            <span className="ao-btn-text">İlk</span>
          </button>
          <button 
            onClick={() => goToPage(currentPage - 1)} 
            disabled={currentPage === 1}
            className="ao-pagination-btn ao-prev-page"
            title="Əvvəlki səhifə"
          >
            <FiChevronLeft />
            <span className="ao-btn-text">Əvvəl</span>
          </button>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} className="ao-pagination-dots">...</span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`ao-pagination-btn ao-page-number ${currentPage === page ? 'ao-active' : ''}`}
                title={`Səhifə ${page}`}
              >
                {page}
              </button>
            )
          ))}
          
          <button 
            onClick={() => goToPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="ao-pagination-btn ao-next-page"
            title="Sonrakı səhifə"
          >
            <span className="ao-btn-text">Sonra</span>
            <FiChevronRight />
          </button>
          <button 
            onClick={() => goToPage(totalPages)} 
            disabled={currentPage === totalPages}
            className="ao-pagination-btn ao-last-page"
            title="Son səhifə"
          >
            <span className="ao-btn-text">Son</span>
            <FiChevronsRight />
          </button>
        </div>
      )}

      {/* ========== MODALLAR ========== */}
      {viewModal.show && (
        <div className="ao-modal-overlay" onClick={closeViewModal}>
          <div className="ao-modal-content ao-view-modal" onClick={e => e.stopPropagation()}>
            <div className="ao-modal-header">
              <h2>Sifariş Detalları</h2>
              <button className="ao-modal-close" onClick={closeViewModal}>
                <FiX />
              </button>
            </div>
            <div className="ao-modal-body">
              <div className="ao-detail-row">
                <span className="ao-detail-label">Sifariş ID:</span>
                <span className="ao-detail-value">{viewModal.order.id}</span>
              </div>
              <div className="ao-detail-row">
                <span className="ao-detail-label">Müştəri:</span>
                <span className="ao-detail-value">{viewModal.order.customer}</span>
              </div>
              <div className="ao-detail-row">
                <span className="ao-detail-label">Telefon:</span>
                <span className="ao-detail-value">{viewModal.order.phone}</span>
              </div>
              <div className="ao-detail-row">
                <span className="ao-detail-label">Tarix:</span>
                <span className="ao-detail-value">{viewModal.order.date} {viewModal.order.time}</span>
              </div>
              <div className="ao-detail-row">
                <span className="ao-detail-label">Məbləğ:</span>
                <span className="ao-detail-value ao-amount">₼{viewModal.order.amount.toFixed(2)}</span>
              </div>
              <div className="ao-detail-row">
                <span className="ao-detail-label">Status:</span>
                <span className="ao-detail-value">{getStatusBadge(viewModal.order.status)}</span>
              </div>
              <div className="ao-detail-row">
                <span className="ao-detail-label">Ödəniş metodu:</span>
                <span className="ao-detail-value">{viewModal.order.paymentMethod}</span>
              </div>
              <div className="ao-detail-row">
                <span className="ao-detail-label">Məhsul sayı:</span>
                <span className="ao-detail-value">{viewModal.order.items}</span>
              </div>
              <div className="ao-detail-row">
                <span className="ao-detail-label">Ünvan:</span>
                <span className="ao-detail-value">{viewModal.order.address}</span>
              </div>
              {viewModal.order.note && (
                <div className="ao-detail-row">
                  <span className="ao-detail-label">Qeyd:</span>
                  <span className="ao-detail-value ao-note">{viewModal.order.note}</span>
                </div>
              )}
            </div>
            <div className="ao-modal-footer">
              <button className="ao-modal-btn ao-primary" onClick={closeViewModal}>Bağla</button>
            </div>
          </div>
        </div>
      )}

      {editModal.show && (
        <div className="ao-modal-overlay" onClick={closeEditModal}>
          <div className="ao-modal-content ao-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="ao-modal-header">
              <h2>Redaktə et</h2>
              <button className="ao-modal-close" onClick={closeEditModal}>
                <FiX />
              </button>
            </div>
            <div className="ao-modal-body">
              <div className="ao-form-group">
                <label>Sifariş ID: {editModal.order.id}</label>
              </div>
              <div className="ao-form-group">
                <label>
                  {editModal.field === 'customer' ? 'Müştəri adı' :
                   editModal.field === 'phone' ? 'Telefon' :
                   editModal.field === 'address' ? 'Ünvan' :
                   editModal.field === 'amount' ? 'Məbləğ' : 'Dəyər'}
                </label>
                <input
                  type={editModal.field === 'amount' ? 'number' : 'text'}
                  value={editModal.order[editModal.field]}
                  onChange={handleEditChange}
                  className="ao-modal-input"
                  autoFocus
                />
              </div>
            </div>
            <div className="ao-modal-footer">
              <button className="ao-modal-btn ao-secondary" onClick={closeEditModal}>Ləğv et</button>
              <button className="ao-modal-btn ao-primary" onClick={saveEdit}>Yadda saxla</button>
            </div>
          </div>
        </div>
      )}

      {statusModal.show && (
        <div className="ao-modal-overlay" onClick={closeStatusModal}>
          <div className="ao-modal-content ao-status-modal" onClick={e => e.stopPropagation()}>
            <div className="ao-modal-header">
              <h2>Status Dəyiş</h2>
              <button className="ao-modal-close" onClick={closeStatusModal}>
                <FiX />
              </button>
            </div>
            <div className="ao-modal-body">
              <p className="ao-status-info">
                Sifariş ID: <strong>{statusModal.order.id}</strong>
              </p>
              <p className="ao-status-info">
                Cari status: {getStatusBadge(statusModal.order.status)}
              </p>
              <div className="ao-status-options">
                <button 
                  className={`ao-status-option ${statusModal.order.status === 'pending' ? 'ao-active' : ''}`}
                  onClick={() => handleStatusSelect('pending')}
                >
                  <FiClock /> Gözləyir
                </button>
                <button 
                  className={`ao-status-option ${statusModal.order.status === 'processing' ? 'ao-active' : ''}`}
                  onClick={() => handleStatusSelect('processing')}
                >
                  <FiRefreshCw /> Hazırlanır
                </button>
                <button 
                  className={`ao-status-option ${statusModal.order.status === 'completed' ? 'ao-active' : ''}`}
                  onClick={() => handleStatusSelect('completed')}
                >
                  <FiCheck /> Tamamlandı
                </button>
                <button 
                  className={`ao-status-option ${statusModal.order.status === 'cancelled' ? 'ao-active' : ''}`}
                  onClick={() => handleStatusSelect('cancelled')}
                >
                  <FiAlertCircle /> Ləğv edildi
                </button>
              </div>
            </div>
            <div className="ao-modal-footer">
              <button className="ao-modal-btn ao-secondary" onClick={closeStatusModal}>Bağla</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="ao-modal-overlay" onClick={closeDeleteModal}>
          <div className="ao-modal-content ao-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="ao-modal-header">
              <h2>Sifarişi sil</h2>
              <button className="ao-modal-close" onClick={closeDeleteModal}>
                <FiX />
              </button>
            </div>
            <div className="ao-modal-body">
              <p className="ao-delete-warning">
                Sifariş ID: <strong>{deleteModal.orderId}</strong>
              </p>
              <p className="ao-delete-warning">
                Bu sifarişi silmək istədiyinizə əminsiniz?
              </p>
            </div>
            <div className="ao-modal-footer">
              <button className="ao-modal-btn ao-secondary" onClick={closeDeleteModal}>Ləğv et</button>
              <button className="ao-modal-btn ao-danger" onClick={confirmDelete}>Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;