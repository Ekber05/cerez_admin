import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../../../contexts/ProductContext';
import './ProductList.css';
import { 
  FiSearch, FiFilter, FiDownload, FiPrinter, 
  FiEye, FiEdit, FiTrash2, FiChevronLeft, 
  FiChevronRight, FiChevronsLeft, FiChevronsRight,
  FiRefreshCw, FiX, FiCheck, FiClock, FiAlertCircle,
  FiPackage, FiChevronDown, FiImage, FiDollarSign, FiArchive, FiSave,
  FiUpload, FiFileText
} from 'react-icons/fi';

const ProductList = () => {
  const { products, deleteProduct, updateProduct } = useProducts();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  
  const [viewModal, setViewModal] = useState({ show: false, product: null });
  const [editModal, setEditModal] = useState({ show: false, product: null });
  const [imageModal, setImageModal] = useState({ show: false, product: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, productId: null });
  
  const fileInputRef = useRef(null);

  const productsPerPage = 10;

  const categories = [
    'Quru meyvələr',
    'Çərəzlər'
  ];

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

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const getFilteredProducts = () => {
    let filtered = [...products];
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }
    
    if (priceFilter !== 'all') {
      if (priceFilter === 'low') {
        filtered = filtered.filter(product => product.price < 10);
      } else if (priceFilter === 'medium') {
        filtered = filtered.filter(product => product.price >= 10 && product.price < 20);
      } else if (priceFilter === 'high') {
        filtered = filtered.filter(product => product.price >= 20 && product.price < 30);
      } else if (priceFilter === 'premium') {
        filtered = filtered.filter(product => product.price >= 30);
      }
    }
    
    if (stockFilter !== 'all') {
      if (stockFilter === 'inStock') {
        filtered = filtered.filter(product => product.stock > 10);
      } else if (stockFilter === 'lowStock') {
        filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
      } else if (stockFilter === 'outOfStock') {
        filtered = filtered.filter(product => product.stock === 0);
      }
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleViewProduct = (product) => {
    setViewModal({ show: true, product });
  };

  const closeViewModal = () => {
    setViewModal({ show: false, product: null });
  };

  const handleEditProduct = (product) => {
    setEditModal({ 
      show: true, 
      product: { ...product }
    });
  };

  const handleEditChange = (field, value) => {
    setEditModal({
      ...editModal,
      product: {
        ...editModal.product,
        [field]: field === 'price' || field === 'stock' ? parseFloat(value) || 0 : value
      }
    });
  };

  const handleImageSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleEditChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEdit = () => {
    updateProduct(editModal.product);
    setEditModal({ show: false, product: null });
    showNotification('Məhsul məlumatları uğurla yeniləndi!', 'success');
  };

  const closeEditModal = () => {
    setEditModal({ show: false, product: null });
  };

  const handleImageClick = (product) => {
    setImageModal({ show: true, product });
  };

  const closeImageModal = () => {
    setImageModal({ show: false, product: null });
  };

  const handleDeleteClick = (productId) => {
    setDeleteModal({ show: true, productId });
  };

  const confirmDelete = () => {
    deleteProduct(deleteModal.productId);
    
    if (currentProducts.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    
    setDeleteModal({ show: false, productId: null });
    showNotification('Məhsul uğurla silindi!', 'success');
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, productId: null });
  };

  const handleExport = () => {
    const exportData = filteredProducts.map(product => ({
      'Məhsul kodu': product.id,
      'Məhsul adı': product.name,
      'Kateqoriya': product.category,
      'Açıqlama': product.description || '-',
      'Qiymət (AZN/kq)': product.price.toFixed(2),
      'Stok miqdarı (kq)': product.stock,
      'Stok dəyəri (AZN)': (product.price * product.stock).toFixed(2)
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
    link.setAttribute('download', `mehsullar_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification(`${exportData.length} məhsul export edildi!`, 'success');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    const tableRows = filteredProducts.map(product => `
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.description || '-'}</td>
        <td>₼${product.price.toFixed(2)}</td>
        <td>${product.stock} kq</td>
      </tr>
    `).join('');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Məhsul Siyahısı</title>
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
            <h1>Məhsul Siyahısı</h1>
            <p>Çap tarixi: ${new Date().toLocaleDateString('az-AZ')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Məhsul kodu</th>
                <th>Məhsul adı</th>
                <th>Kateqoriya</th>
                <th>Açıqlama</th>
                <th>Qiymət (kq)</th>
                <th>Stok (kq)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">
            <p>Cəmi məhsul: ${filteredProducts.length}</p>
            <p>Ümumi stok dəyəri: ₼${filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
    
    showNotification('Çap səhifəsi açıldı!', 'info');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showNotification('Məlumatlar yeniləndi!', 'info');
    }, 500);
    setCurrentPage(1);
    setSearchTerm('');
    setFilterCategory('all');
    setPriceFilter('all');
    setStockFilter('all');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setPriceFilter('all');
    setStockFilter('all');
    setCurrentPage(1);
    showNotification('Filtrlər təmizləndi!', 'info');
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getCategoryLabel = (category) => {
    if (category === 'all') return 'Bütün kateqoriyalar';
    return category;
  };

  const getPriceLabel = (price) => {
    switch(price) {
      case 'all': return 'Bütün qiymətlər';
      case 'low': return '10 AZN -dən az';
      case 'medium': return '10 - 20 AZN';
      case 'high': return '20 - 30 AZN';
      case 'premium': return '30 AZN -dən çox';
      default: return 'Qiymət';
    }
  };

  const getStockLabel = (stock) => {
    switch(stock) {
      case 'all': return 'Bütün stoklar';
      case 'inStock': return 'Stokda (10kq+)';
      case 'lowStock': return 'Az qalıb (1-10kq)';
      case 'outOfStock': return 'Bitib (0)';
      default: return 'Stok';
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

  const getTextClass = (text) => {
    if (!text) return '';
    if (text.length > 60) return 'pl-font-size-11';
    if (text.length > 40) return 'pl-font-size-12';
    if (text.length > 30) return 'pl-font-size-13';
    return '';
  };

  if (loading) {
    return (
      <div className="pl-container">
        <div className="pl-loading-container">
          <div className="pl-loading-spinner"></div>
          <p>Məhsullar yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-container">
      {/* Bildiriş */}
      {notification.show && (
        <div className={`pl-notification pl-notification-${notification.type}`}>
          <div className="pl-notification-content">
            {notification.type === 'success' && <FiCheck />}
            {notification.type === 'info' && <FiClock />}
            {notification.type === 'error' && <FiAlertCircle />}
            <span>{notification.message}</span>
          </div>
          <button className="pl-notification-close" onClick={() => setNotification({ show: false, message: '', type: 'success' })}>
            <FiX />
          </button>
        </div>
      )}

      {/* Başlıq və əməliyyatlar */}
      <div className="pl-header">
        <div>
          <h1 className="pl-page-title">Məhsul siyahısı</h1>
        </div>
        <div className="pl-header-actions">
          <button className="pl-action-btn pl-refresh-btn" onClick={handleRefresh} title="Yenilə">
            <FiRefreshCw /> Yenilə
          </button>
          <button className="pl-action-btn pl-export-btn" onClick={handleExport}>
            <FiDownload /> Export
          </button>
          <button className="pl-action-btn pl-print-btn" onClick={handlePrint}>
            <FiPrinter /> Çap et
          </button>
        </div>
      </div>

      {/* Filterlər */}
      <div className="pl-compact-filters" ref={dropdownRef}>
        <div className="pl-search-wrapper">
          <FiSearch className="pl-search-icon" />
          <input
            type="text"
            placeholder="Axtarış (məhsul adı, kod, kateqoriya, açıqlama...)"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-search-input"
          />
          {searchTerm && (
            <FiX className="pl-clear-search" onClick={() => setSearchTerm('')} />
          )}
        </div>

        <div className="pl-filter-buttons">
          {/* Kateqoriya filter */}
          <div className="pl-filter-dropdown">
            <button 
              className={`pl-filter-btn ${filterCategory !== 'all' ? 'pl-active' : ''}`}
              onClick={() => toggleDropdown('category')}
            >
              <FiPackage />
              <span>{getCategoryLabel(filterCategory)}</span>
              <FiChevronDown className={`pl-dropdown-arrow ${openDropdown === 'category' ? 'pl-open' : ''}`} />
            </button>
            {openDropdown === 'category' && (
              <div className="pl-dropdown-menu">
                <div 
                  className={`pl-dropdown-item ${filterCategory === 'all' ? 'pl-selected' : ''}`}
                  onClick={() => { setFilterCategory('all'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Bütün kateqoriyalar
                </div>
                <div 
                  className={`pl-dropdown-item ${filterCategory === 'Quru meyvələr' ? 'pl-selected' : ''}`}
                  onClick={() => { setFilterCategory('Quru meyvələr'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Quru meyvələr
                </div>
                <div 
                  className={`pl-dropdown-item ${filterCategory === 'Çərəzlər' ? 'pl-selected' : ''}`}
                  onClick={() => { setFilterCategory('Çərəzlər'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Çərəzlər
                </div>
              </div>
            )}
          </div>

          {/* Qiymət filter */}
          <div className="pl-filter-dropdown">
            <button 
              className={`pl-filter-btn ${priceFilter !== 'all' ? 'pl-active' : ''}`}
              onClick={() => toggleDropdown('price')}
            >
              <FiDollarSign />
              <span>{getPriceLabel(priceFilter)}</span>
              <FiChevronDown className={`pl-dropdown-arrow ${openDropdown === 'price' ? 'pl-open' : ''}`} />
            </button>
            {openDropdown === 'price' && (
              <div className="pl-dropdown-menu">
                <div 
                  className={`pl-dropdown-item ${priceFilter === 'all' ? 'pl-selected' : ''}`}
                  onClick={() => { setPriceFilter('all'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Bütün qiymətlər
                </div>
                <div 
                  className={`pl-dropdown-item ${priceFilter === 'low' ? 'pl-selected' : ''}`}
                  onClick={() => { setPriceFilter('low'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  10 AZN -dən az
                </div>
                <div 
                  className={`pl-dropdown-item ${priceFilter === 'medium' ? 'pl-selected' : ''}`}
                  onClick={() => { setPriceFilter('medium'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  10 - 20 AZN
                </div>
                <div 
                  className={`pl-dropdown-item ${priceFilter === 'high' ? 'pl-selected' : ''}`}
                  onClick={() => { setPriceFilter('high'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  20 - 30 AZN
                </div>
                <div 
                  className={`pl-dropdown-item ${priceFilter === 'premium' ? 'pl-selected' : ''}`}
                  onClick={() => { setPriceFilter('premium'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  30 AZN -dən çox
                </div>
              </div>
            )}
          </div>

          {/* Stok filter */}
          <div className="pl-filter-dropdown">
            <button 
              className={`pl-filter-btn ${stockFilter !== 'all' ? 'pl-active' : ''}`}
              onClick={() => toggleDropdown('stock')}
            >
              <FiArchive />
              <span>{getStockLabel(stockFilter)}</span>
              <FiChevronDown className={`pl-dropdown-arrow ${openDropdown === 'stock' ? 'pl-open' : ''}`} />
            </button>
            {openDropdown === 'stock' && (
              <div className="pl-dropdown-menu">
                <div 
                  className={`pl-dropdown-item ${stockFilter === 'all' ? 'pl-selected' : ''}`}
                  onClick={() => { setStockFilter('all'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Bütün stoklar
                </div>
                <div 
                  className={`pl-dropdown-item ${stockFilter === 'inStock' ? 'pl-selected' : ''}`}
                  onClick={() => { setStockFilter('inStock'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Stokda (10kq+)
                </div>
                <div 
                  className={`pl-dropdown-item ${stockFilter === 'lowStock' ? 'pl-selected' : ''}`}
                  onClick={() => { setStockFilter('lowStock'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Az qalıb (1-10kq)
                </div>
                <div 
                  className={`pl-dropdown-item ${stockFilter === 'outOfStock' ? 'pl-selected' : ''}`}
                  onClick={() => { setStockFilter('outOfStock'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Bitib (0)
                </div>
              </div>
            )}
          </div>

          {/* Təmizlə düyməsi */}
          {(searchTerm || filterCategory !== 'all' || priceFilter !== 'all' || stockFilter !== 'all') && (
            <button className="pl-filter-btn pl-clear-all-btn" onClick={clearFilters}>
              <FiX /> Təmizlə
            </button>
          )}
        </div>

        {/* Aktiv filtrlər */}
        {(searchTerm || filterCategory !== 'all' || priceFilter !== 'all' || stockFilter !== 'all') && (
          <div className="pl-compact-active-filters">
            {searchTerm && (
              <span className="pl-compact-active-filter">
                "{searchTerm}"
                <FiX onClick={() => setSearchTerm('')} />
              </span>
            )}
            {filterCategory !== 'all' && (
              <span className="pl-compact-active-filter">
                {filterCategory}
                <FiX onClick={() => setFilterCategory('all')} />
              </span>
            )}
            {priceFilter !== 'all' && (
              <span className="pl-compact-active-filter">
                {priceFilter === 'low' ? '< 10₼' :
                 priceFilter === 'medium' ? '10-20₼' :
                 priceFilter === 'high' ? '20-30₼' : '> 30₼'}
                <FiX onClick={() => setPriceFilter('all')} />
              </span>
            )}
            {stockFilter !== 'all' && (
              <span className="pl-compact-active-filter">
                {stockFilter === 'inStock' ? 'Stokda' :
                 stockFilter === 'lowStock' ? 'Az qalıb' : 'Bitib'}
                <FiX onClick={() => setStockFilter('all')} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Nəticə sayı */}
      <div className="pl-results-info">
        <p>Cəmi <strong>{filteredProducts.length}</strong> məhsul tapıldı</p>
        {filteredProducts.length > 0 && (
          <p className="pl-results-detail">
            Səhifə: {currentPage} / {totalPages}
          </p>
        )}
      </div>

      {/* Məhsullar cədvəli */}
      <div className="pl-table-wrapper">
        {filteredProducts.length === 0 ? (
          <div className="pl-no-data">
            <FiPackage size={48} />
            <p>Heç bir məhsul tapılmadı</p>
            <button className="pl-clear-filters-btn" onClick={clearFilters}>
              Filtrləri təmizlə
            </button>
          </div>
        ) : (
          <table className="pl-table">
            <thead>
              <tr>
                <th>Məhsul kodu</th>
                <th>Şəkil</th>
                <th>Məhsul adı</th>
                <th>Kateqoriya</th>
                <th>Açıqlama</th>
                <th>Qiymət (kq)</th>
                <th>Stok (kq)</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="pl-product-sku">{product.id}</td>
                  <td className="pl-product-image-cell">
                    <div className="pl-product-image-wrapper" onClick={() => handleImageClick(product)}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="pl-product-image" />
                      ) : (
                        <div className="pl-product-image-placeholder">
                          <FiImage />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={`pl-product-name ${getTextClass(product.name)}`}>{product.name}</td>
                  <td>
                    <span className={`pl-product-category ${getTextClass(product.category)}`}>{product.category}</span>
                  </td>
                  <td className={`pl-product-description ${getTextClass(product.description || '')}`}>
                    {product.description || '-'}
                  </td>
                  <td className="pl-product-price">₼{product.price.toFixed(2)}</td>
                  <td className="pl-product-stock">{product.stock}</td>
                  <td>
                    <div className="pl-action-buttons">
                      <button 
                        className="pl-action-btn pl-view-btn" 
                        onClick={() => handleViewProduct(product)}
                        title="Məhsula bax"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="pl-action-btn pl-edit-btn" 
                        onClick={() => handleEditProduct(product)}
                        title="Redaktə et"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="pl-action-btn pl-image-btn" 
                        onClick={() => handleImageClick(product)}
                        title="Şəkilə bax"
                      >
                        <FiImage />
                      </button>
                      <button 
                        className="pl-action-btn pl-delete-btn" 
                        onClick={() => handleDeleteClick(product.id)}
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

      {/* Səhifələmə */}
      {totalPages > 1 && (
        <div className="pl-pagination">
          <button 
            onClick={() => goToPage(1)} 
            disabled={currentPage === 1}
            className="pl-pagination-btn pl-first-page"
            title="İlk səhifə"
          >
            <FiChevronsLeft />
            <span className="pl-btn-text">İlk</span>
          </button>
          <button 
            onClick={() => goToPage(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pl-pagination-btn pl-prev-page"
            title="Əvvəlki səhifə"
          >
            <FiChevronLeft />
            <span className="pl-btn-text">Əvvəl</span>
          </button>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} className="pl-pagination-dots">...</span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`pl-pagination-btn pl-page-number ${currentPage === page ? 'pl-active' : ''}`}
              >
                {page}
              </button>
            )
          ))}
          
          <button 
            onClick={() => goToPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pl-pagination-btn pl-next-page"
            title="Sonrakı səhifə"
          >
            <span className="pl-btn-text">Sonra</span>
            <FiChevronRight />
          </button>
          <button 
            onClick={() => goToPage(totalPages)} 
            disabled={currentPage === totalPages}
            className="pl-pagination-btn pl-last-page"
            title="Son səhifə"
          >
            <span className="pl-btn-text">Son</span>
            <FiChevronsRight />
          </button>
        </div>
      )}

      {/* ========== MODALLAR (eyni qalır, yalnız classlara pl- prefiksi əlavə edildi) ========== */}
      
      {/* Baxış modali */}
      {viewModal.show && (
        <div className="pl-modal-overlay" onClick={closeViewModal}>
          <div className="pl-modal-content pl-view-modal" onClick={e => e.stopPropagation()}>
            <div className="pl-modal-header">
              <h2>Məhsul Detalları</h2>
              <button className="pl-modal-close" onClick={closeViewModal}>
                <FiX />
              </button>
            </div>
            <div className="pl-modal-body">
              <div className="pl-product-detail-image">
                {viewModal.product.image ? (
                  <img src={viewModal.product.image} alt={viewModal.product.name} />
                ) : (
                  <div className="pl-product-image-placeholder pl-large">
                    <FiImage />
                  </div>
                )}
              </div>
              <div className="pl-detail-row">
                <span className="pl-detail-label">Məhsul kodu:</span>
                <span className="pl-detail-value">{viewModal.product.id}</span>
              </div>
              <div className="pl-detail-row">
                <span className="pl-detail-label">Məhsul adı:</span>
                <span className="pl-detail-value">{viewModal.product.name}</span>
              </div>
              <div className="pl-detail-row">
                <span className="pl-detail-label">Kateqoriya:</span>
                <span className="pl-detail-value">{viewModal.product.category}</span>
              </div>
              <div className="pl-detail-row">
                <span className="pl-detail-label">Açıqlama:</span>
                <span className="pl-detail-value pl-description">{viewModal.product.description || '-'}</span>
              </div>
              <div className="pl-detail-row">
                <span className="pl-detail-label">Qiymət:</span>
                <span className="pl-detail-value pl-amount">₼{viewModal.product.price.toFixed(2)} / kq</span>
              </div>
              <div className="pl-detail-row">
                <span className="pl-detail-label">Stok miqdarı:</span>
                <span className="pl-detail-value">{viewModal.product.stock} kq</span>
              </div>
            </div>
            <div className="pl-modal-footer">
              <button className="pl-modal-btn pl-primary" onClick={closeViewModal}>Bağla</button>
            </div>
          </div>
        </div>
      )}

      {/* Redaktə modali */}
      {editModal.show && (
        <div className="pl-modal-overlay" onClick={closeEditModal}>
          <div className="pl-modal-content pl-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="pl-modal-header">
              <h2>Məhsulu Redaktə Et</h2>
              <button className="pl-modal-close" onClick={closeEditModal}>
                <FiX />
              </button>
            </div>
            <div className="pl-modal-body">
              <div className="pl-form-group">
                <label>Məhsul kodu</label>
                <input
                  type="text"
                  value={editModal.product.id}
                  onChange={(e) => handleEditChange('id', e.target.value)}
                  className="pl-modal-input"
                  placeholder="Məhsul kodu"
                />
              </div>

              <div className="pl-form-group">
                <label>Məhsul adı</label>
                <input
                  type="text"
                  value={editModal.product.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="pl-modal-input"
                  placeholder="Məhsul adı"
                />
              </div>

              <div className="pl-form-group">
                <label>Kateqoriya</label>
                <select
                  value={editModal.product.category}
                  onChange={(e) => handleEditChange('category', e.target.value)}
                  className="pl-modal-input"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="pl-form-group">
                <label>Açıqlama</label>
                <textarea
                  value={editModal.product.description || ''}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  className="pl-modal-input pl-textarea"
                  placeholder="Məhsul haqqında qısa açıqlama..."
                  rows={3}
                />
              </div>

              <div className="pl-form-row">
                <div className="pl-form-group pl-half">
                  <label>Qiymət (AZN/kq)</label>
                  <input
                    type="number"
                    value={editModal.product.price}
                    onChange={(e) => handleEditChange('price', e.target.value)}
                    className="pl-modal-input"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="pl-form-group pl-half">
                  <label>Stok miqdarı (kq)</label>
                  <input
                    type="number"
                    value={editModal.product.stock}
                    onChange={(e) => handleEditChange('stock', e.target.value)}
                    className="pl-modal-input"
                    step="0.1"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="pl-form-group">
                <label>Məhsul şəkli</label>
                <div className="pl-image-upload-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  <div className="pl-image-upload-buttons">
                    <button 
                      type="button" 
                      className="pl-upload-btn pl-file-btn"
                      onClick={handleImageSelect}
                    >
                      <FiUpload /> Medi yüklə
                    </button>
                  </div>

                  {editModal.product.image && (
                    <div className="pl-image-preview">
                      <img 
                        src={editModal.product.image} 
                        alt="Preview" 
                        className="pl-preview-image"
                      />
                      <button 
                        className="pl-remove-image-btn"
                        onClick={() => handleEditChange('image', null)}
                        title="Şəkili sil"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pl-modal-footer">
              <button className="pl-modal-btn pl-secondary" onClick={closeEditModal}>Ləğv et</button>
              <button className="pl-modal-btn pl-primary" onClick={saveEdit}>
                <FiSave /> Yadda saxla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Şəkil modali */}
      {imageModal.show && (
        <div className="pl-modal-overlay" onClick={closeImageModal}>
          <div className="pl-modal-content pl-image-modal" onClick={e => e.stopPropagation()}>
            <div className="pl-modal-header">
              <h2>{imageModal.product.name}</h2>
              <button className="pl-modal-close" onClick={closeImageModal}>
                <FiX />
              </button>
            </div>
            <div className="pl-modal-body pl-image-modal-body">
              {imageModal.product.image ? (
                <img 
                  src={imageModal.product.image} 
                  alt={imageModal.product.name}
                  className="pl-full-image"
                />
              ) : (
                <div className="pl-no-image-large">
                  <FiImage size={80} />
                  <p>Şəkil yoxdur</p>
                </div>
              )}
            </div>
            <div className="pl-modal-footer">
              <button className="pl-modal-btn pl-primary" onClick={closeImageModal}>Bağla</button>
            </div>
          </div>
        </div>
      )}

      {/* Sil modali */}
      {deleteModal.show && (
        <div className="pl-modal-overlay" onClick={closeDeleteModal}>
          <div className="pl-modal-content pl-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="pl-modal-header">
              <h2>Məhsulu Sil</h2>
              <button className="pl-modal-close" onClick={closeDeleteModal}>
                <FiX />
              </button>
            </div>
            <div className="pl-modal-body">
              <FiAlertCircle size={48} className="pl-delete-icon" />
              <p className="pl-delete-warning">
                Məhsul kodu: <strong>{deleteModal.productId}</strong>
              </p>
              <p className="pl-delete-warning">
                Bu məhsulu silmək istədiyinizə əminsiniz?
              </p>
              <p className="pl-delete-note">
                Bu əməliyyat geri qaytarıla bilməz.
              </p>
            </div>
            <div className="pl-modal-footer">
              <button className="pl-modal-btn pl-secondary" onClick={closeDeleteModal}>Ləğv et</button>
              <button className="pl-modal-btn pl-danger" onClick={confirmDelete}>Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;