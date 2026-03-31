// src/components/AdminPanel/components/ProductList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../../contexts/ProductContext';
import StockManagement from './StockManagement';
import Pagination from './Pagination';
import './ProductList.css';
import { 
  FiSearch, FiDownload, FiPrinter, 
  FiEye, FiEdit, FiTrash2,
  FiRefreshCw, FiX, FiCheck, FiClock, FiAlertCircle,
  FiPackage, FiChevronDown, FiImage, FiDollarSign, FiArchive, FiSave,
  FiUpload
} from 'react-icons/fi';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, deleteProduct, updateProduct } = useProducts();

  const [loading, setLoading] = useState(false);
  
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
  const [stockModal, setStockModal] = useState({ show: false, product: null });
  const [stockMovements, setStockMovements] = useState([]);
  
  const fileInputRef = useRef(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const productsPerPage = 20;

  const categories = [
    'Meyvə quruları',
    'Duzlu çərəzlər',
    'Şokoladlı çərəzlər',
    'Ədviyyatlar',
    'Paxlalılar və Taxıllar',
    'Bitki Yağları',
    'Qurudulmuş Otlar və Çaylar',
    'Hədiyyə paketləri'
  ];

  // URL-dən filter parametrlərini oxu
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setFilterCategory(categoryFromUrl);
    }
    
    const priceFromUrl = searchParams.get('price');
    if (priceFromUrl && ['low', 'medium', 'high', 'premium'].includes(priceFromUrl)) {
      setPriceFilter(priceFromUrl);
    }
    
    const stockFromUrl = searchParams.get('stock');
    if (stockFromUrl && ['inStock', 'lowStock', 'outOfStock'].includes(stockFromUrl)) {
      setStockFilter(stockFromUrl);
    }
    
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, []);

  // URL parametrlərini yenilə
  const updateUrlParams = (category, price, stock, search) => {
    const newParams = new URLSearchParams();
    
    if (category && category !== 'all') {
      newParams.set('category', category);
    }
    if (price && price !== 'all') {
      newParams.set('price', price);
    }
    if (stock && stock !== 'all') {
      newParams.set('stock', stock);
    }
    if (search && search.trim() !== '') {
      newParams.set('search', search);
    }
    
    setSearchParams(newParams, { replace: false });
  };

  // Stok hərəkətlərini yüklə
  useEffect(() => {
    const savedMovements = localStorage.getItem('stock_movements');
    if (savedMovements) {
      setStockMovements(JSON.parse(savedMovements));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
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

  // Məhsulu normallaşdır
  const normalizeProduct = (product) => {
    return {
      ...product,
      pricePerKg: product.pricePerKg !== undefined ? product.pricePerKg : (product.price || 0),
      img: product.img || product.image || null,
      stock: product.stock !== undefined ? product.stock : 0
    };
  };

  // Stok yeniləmə funksiyası
  const handleUpdateStock = async (productId, newStock, movement) => {
    const productIdStr = String(productId);
    const product = products.find(p => String(p.id) === productIdStr);
    if (!product) return;
    
    const updatedProduct = { ...product, stock: newStock };
    updateProduct(updatedProduct);
    
    setStockMovements(prev => [movement, ...prev]);
    
    const savedMovements = JSON.parse(localStorage.getItem('stock_movements') || '[]');
    savedMovements.push(movement);
    localStorage.setItem('stock_movements', JSON.stringify(savedMovements));
    
    showNotification(`${movement.type === 'in' ? '✅ Stok əlavə edildi!' : '⚠️ Stok azaldıldı!'}`, 'success');
  };

  const getFilteredProducts = () => {
    let filtered = products.map(normalizeProduct);
    
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        String(product.name).toLowerCase().includes(searchLower) ||
        String(product.id).toLowerCase().includes(searchLower) ||
        String(product.category).toLowerCase().includes(searchLower) ||
        (product.description && String(product.description).toLowerCase().includes(searchLower))
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }
    
    const getProductPrice = (product) => product.pricePerKg || product.price || 0;
    
    if (priceFilter !== 'all') {
      if (priceFilter === 'low') {
        filtered = filtered.filter(product => getProductPrice(product) < 10);
      } else if (priceFilter === 'medium') {
        filtered = filtered.filter(product => getProductPrice(product) >= 10 && getProductPrice(product) < 20);
      } else if (priceFilter === 'high') {
        filtered = filtered.filter(product => getProductPrice(product) >= 20 && getProductPrice(product) < 30);
      } else if (priceFilter === 'premium') {
        filtered = filtered.filter(product => getProductPrice(product) >= 30);
      }
    }
    
    if (stockFilter !== 'all') {
      if (stockFilter === 'inStock') {
        filtered = filtered.filter(product => (product.stock || 0) > 10);
      } else if (stockFilter === 'lowStock') {
        filtered = filtered.filter(product => (product.stock || 0) > 0 && (product.stock || 0) <= 10);
      } else if (stockFilter === 'outOfStock') {
        filtered = filtered.filter(product => (product.stock || 0) === 0);
      }
    }
    
    filtered.sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      const orderA = a.order !== undefined ? a.order : 999;
      const orderB = b.order !== undefined ? b.order : 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return String(a.id).localeCompare(String(b.id));
    });
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const getStockStatus = (stock) => {
    const stockValue = stock || 0;
    if (stockValue <= 0) {
      return { class: 'stock-critical', text: 'Bitib!', icon: '🔴' };
    } else if (stockValue <= 10) {
      return { class: 'stock-low', text: 'Az qalıb', icon: '🟡' };
    } else if (stockValue <= 50) {
      return { class: 'stock-medium', text: 'Normal', icon: '🟢' };
    }
    return { class: 'stock-high', text: 'Çoxdur', icon: '✅' };
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    updateUrlParams(filterCategory, priceFilter, stockFilter, value);
  };

  const handleFilterCategoryChange = (category) => {
    setFilterCategory(category);
    setCurrentPage(1);
    setOpenDropdown(null);
    updateUrlParams(category, priceFilter, stockFilter, searchTerm);
  };

  const handlePriceFilterChange = (price) => {
    setPriceFilter(price);
    setCurrentPage(1);
    setOpenDropdown(null);
    updateUrlParams(filterCategory, price, stockFilter, searchTerm);
  };

  const handleStockFilterChange = (stock) => {
    setStockFilter(stock);
    setCurrentPage(1);
    setOpenDropdown(null);
    updateUrlParams(filterCategory, priceFilter, stock, searchTerm);
  };

  // Səhifə dəyişmə funksiyası - SADƏCƏ STATE YENİLƏYİR
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleViewProduct = (product) => {
    setViewModal({ show: true, product: normalizeProduct(product) });
  };

  const closeViewModal = () => {
    setViewModal({ show: false, product: null });
  };

  const handleEditProduct = (product) => {
    setEditModal({ 
      show: true, 
      product: normalizeProduct({ ...product })
    });
  };

  const handleEditChange = (field, value) => {
    setEditModal({
      ...editModal,
      product: {
        ...editModal.product,
        [field]: field === 'pricePerKg' || field === 'stock' ? parseFloat(value) || 0 : 
                 field === 'order' ? parseInt(value) || 0 : 
                 field === 'id' ? String(value) : value
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
        handleEditChange('img', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEdit = () => {
    const updatedProduct = {
      ...editModal.product,
      id: String(editModal.product.id)
    };
    updateProduct(updatedProduct);
    setEditModal({ show: false, product: null });
    showNotification('Məhsul məlumatları uğurla yeniləndi!', 'success');
  };

  const closeEditModal = () => {
    setEditModal({ show: false, product: null });
  };

  const handleImageClick = (product) => {
    setImageModal({ show: true, product: normalizeProduct(product) });
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
      'ID': String(product.id),
      'Məhsul adı': product.name,
      'Kateqoriya': product.category,
      'Açıqlama': product.description || '-',
      'Qiymət (AZN/kq)': (product.pricePerKg || product.price || 0).toFixed(2),
      'Stok miqdarı (kq)': product.stock || 0,
      'Stok dəyəri (AZN)': ((product.pricePerKg || product.price || 0) * (product.stock || 0)).toFixed(2),
      'Yerləşmə': product.featured ? 'Ana səhifə' : 'Bütün məhsullar'
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
          <td>${String(product.id)}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${product.description || '-'}</td>
          <td>₼${(product.pricePerKg || product.price || 0).toFixed(2)}</td>
          <td>${product.stock || 0} kq</td>
          <td>${product.featured ? 'Ana səhifə' : 'Bütün məhsullar'}</td>
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
                <th>ID</th>
                <th>Məhsul adı</th>
                <th>Kateqoriya</th>
                <th>Açıqlama</th>
                <th>Qiymət (kq)</th>
                <th>Stok (kq)</th>
                <th>Yerləşmə</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">
            <p>Cəmi məhsul: ${filteredProducts.length}</p>
            <p>Ümumi stok dəyəri: ₼${filteredProducts.reduce((sum, p) => sum + ((p.pricePerKg || p.price || 0) * (p.stock || 0)), 0).toFixed(2)}</p>
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
    setSearchParams({}, { replace: true });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setPriceFilter('all');
    setStockFilter('all');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
    showNotification('Filtrlər təmizləndi!', 'info');
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
            placeholder="Axtarış (məhsul adı, ID, kateqoriya, açıqlama...)"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-search-input"
          />
          {searchTerm && (
            <FiX className="pl-clear-search" onClick={() => {
              setSearchTerm('');
              setCurrentPage(1);
              updateUrlParams(filterCategory, priceFilter, stockFilter, '');
            }} />
          )}
        </div>

        <div className="pl-filter-buttons">
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
                  onClick={() => handleFilterCategoryChange('all')}
                >
                  Bütün kateqoriyalar
                </div>
                {categories.map(category => (
                  <div 
                    key={category}
                    className={`pl-dropdown-item ${filterCategory === category ? 'pl-selected' : ''}`}
                    onClick={() => handleFilterCategoryChange(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>

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
                  onClick={() => handlePriceFilterChange('all')}
                >
                  Bütün qiymətlər
                </div>
                <div 
                  className={`pl-dropdown-item ${priceFilter === 'low' ? 'pl-selected' : ''}`}
                  onClick={() => handlePriceFilterChange('low')}
                >
                  10 AZN -dən az
                </div>
                <div 
                  className={`pl-dropdown-item ${priceFilter === 'medium' ? 'pl-selected' : ''}`}
                  onClick={() => handlePriceFilterChange('medium')}
                >
                  10 - 20 AZN
                </div>
                <div 
                  className={`pl-dropdown-item ${priceFilter === 'high' ? 'pl-selected' : ''}`}
                  onClick={() => handlePriceFilterChange('high')}
                >
                  20 - 30 AZN
                </div>
                <div 
                  className={`pl-dropdown-item ${priceFilter === 'premium' ? 'pl-selected' : ''}`}
                  onClick={() => handlePriceFilterChange('premium')}
                >
                  30 AZN -dən çox
                </div>
              </div>
            )}
          </div>

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
                  onClick={() => handleStockFilterChange('all')}
                >
                  Bütün stoklar
                </div>
                <div 
                  className={`pl-dropdown-item ${stockFilter === 'inStock' ? 'pl-selected' : ''}`}
                  onClick={() => handleStockFilterChange('inStock')}
                >
                  Stokda (10kq+)
                </div>
                <div 
                  className={`pl-dropdown-item ${stockFilter === 'lowStock' ? 'pl-selected' : ''}`}
                  onClick={() => handleStockFilterChange('lowStock')}
                >
                  Az qalıb (1-10kq)
                </div>
                <div 
                  className={`pl-dropdown-item ${stockFilter === 'outOfStock' ? 'pl-selected' : ''}`}
                  onClick={() => handleStockFilterChange('outOfStock')}
                >
                  Bitib (0)
                </div>
              </div>
            )}
          </div>

          {(searchTerm || filterCategory !== 'all' || priceFilter !== 'all' || stockFilter !== 'all') && (
            <button className="pl-filter-btn pl-clear-all-btn" onClick={clearFilters}>
              <FiX /> Təmizlə
            </button>
          )}
        </div>

        {(searchTerm || filterCategory !== 'all' || priceFilter !== 'all' || stockFilter !== 'all') && (
          <div className="pl-compact-active-filters">
            {searchTerm && (
              <span className="pl-compact-active-filter">
                "{searchTerm}"
                <FiX onClick={() => {
                  setSearchTerm('');
                  updateUrlParams(filterCategory, priceFilter, stockFilter, '');
                }} />
              </span>
            )}
            {filterCategory !== 'all' && (
              <span className="pl-compact-active-filter">
                {filterCategory}
                <FiX onClick={() => handleFilterCategoryChange('all')} />
              </span>
            )}
            {priceFilter !== 'all' && (
              <span className="pl-compact-active-filter">
                {priceFilter === 'low' ? '< 10₼' :
                 priceFilter === 'medium' ? '10-20₼' :
                 priceFilter === 'high' ? '20-30₼' : '> 30₼'}
                <FiX onClick={() => handlePriceFilterChange('all')} />
              </span>
            )}
            {stockFilter !== 'all' && (
              <span className="pl-compact-active-filter">
                {stockFilter === 'inStock' ? 'Stokda' :
                 stockFilter === 'lowStock' ? 'Az qalıb' : 'Bitib'}
                <FiX onClick={() => handleStockFilterChange('all')} />
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pl-results-info">
        <p>Cəmi <strong>{filteredProducts.length}</strong> məhsul tapıldı</p>
        {filteredProducts.length > 0 && (
          <p className="pl-results-detail">
            Səhifə: {currentPage} / {totalPages}
          </p>
        )}
      </div>

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
                <th>№</th>
                <th>Şəkil</th>
                <th>Məhsul adı</th>
                <th>Kateqoriya</th>
                <th>Açıqlama</th>
                <th>Qiymət</th>
                <th>Stok</th>
                <th>Yerləşmə</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.stock);
                const productPrice = product.pricePerKg || product.price || 0;
                const productImage = product.img || product.image;
                
                return (
                  <tr key={String(product.id)}>
                    <td className="pl-product-id">{index + 1 + (currentPage - 1) * productsPerPage}</td>
                    <td className="pl-product-image-cell">
                      <div className="pl-product-image-wrapper" onClick={() => handleImageClick(product)}>
                        {productImage ? (
                          <img src={productImage} alt={product.name} className="pl-product-image" />
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
                    <td className="pl-product-price">₼{productPrice.toFixed(2)}</td>
                    <td className="pl-product-stock">
                      <div className={`stock-status-display ${stockStatus.class}`}>
                        <span className="stock-icon">{stockStatus.icon}</span>
                        <span className="stock-value">{product.stock || 0} kq</span>
                        <span className="stock-text">{stockStatus.text}</span>
                      </div>
                    </td>
                    <td className="pl-product-placement">
                      {product.featured ? (
                        <div className="pl-placement-badge featured">
                          <span className="placement-icon">⭐</span>
                          <span className="placement-text">Ana səhifə</span>
                          {product.order !== undefined && product.order > 0 && (
                            <span className="placement-order">#{product.order}</span>
                          )}
                        </div>
                      ) : (
                        <div className="pl-placement-badge normal">
                          <span className="placement-icon">📦</span>
                          <span className="placement-text">Bütün məhsullar</span>
                        </div>
                      )}
                    </td>
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
                          className="pl-action-btn pl-stock-btn" 
                          onClick={() => setStockModal({ show: true, product })}
                          title="Stok idarəsi"
                        >
                          <FiPackage />
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Vahid Pagination Komponenti */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageParamName="page"
          scrollToTop={true}
        />
      )}

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
                {(viewModal.product.img || viewModal.product.image) ? (
                  <img src={viewModal.product.img || viewModal.product.image} alt={viewModal.product.name} />
                ) : (
                  <div className="pl-product-image-placeholder pl-large">
                    <FiImage />
                  </div>
                )}
              </div>
              <div className="pl-detail-row">
                <span className="pl-detail-label">ID:</span>
                <span className="pl-detail-value">{String(viewModal.product.id)}</span>
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
                <span className="pl-detail-value pl-amount">
                  ₼{(viewModal.product.pricePerKg || viewModal.product.price || 0).toFixed(2)} / kq
                </span>
              </div>
              <div className="pl-detail-row">
                <span className="pl-detail-label">Stok miqdarı:</span>
                <span className="pl-detail-value">{viewModal.product.stock || 0} kq</span>
              </div>
              <div className="pl-detail-row">
                <span className="pl-detail-label">Yerləşmə:</span>
                <span className="pl-detail-value">
                  {viewModal.product.featured ? (
                    <div className="pl-placement-badge featured small">
                      <span className="placement-icon">⭐</span>
                      <span className="placement-text">Ana səhifə (Sıra: {viewModal.product.order || '-'})</span>
                    </div>
                  ) : (
                    <div className="pl-placement-badge normal small">
                      <span className="placement-icon">📦</span>
                      <span className="placement-text">Bütün məhsullar</span>
                    </div>
                  )}
                </span>
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
                <label>ID (String)</label>
                <input
                  type="text"
                  value={String(editModal.product.id)}
                  onChange={(e) => handleEditChange('id', e.target.value)}
                  className="pl-modal-input"
                  placeholder="ID"
                  disabled
                />
                <small className="pl-field-hint">ID avtomatik yaradılır və dəyişdirilə bilməz</small>
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
                <div className="custom-category-dropdown" ref={categoryDropdownRef}>
                  <div 
                    className={`dropdown-trigger ${isCategoryDropdownOpen ? 'open' : ''}`}
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  >
                    <span>{editModal.product.category}</span>
                    <FiChevronDown className={`dropdown-arrow ${isCategoryDropdownOpen ? 'rotate' : ''}`} />
                  </div>
                  {isCategoryDropdownOpen && (
                    <div className="dropdown-menu">
                      {categories.map(cat => (
                        <div
                          key={cat}
                          className={`dropdown-item ${editModal.product.category === cat ? 'selected' : ''}`}
                          onClick={() => {
                            handleEditChange('category', cat);
                            setIsCategoryDropdownOpen(false);
                          }}
                        >
                          {cat}
                          {editModal.product.category === cat && <span className="check-icon">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                    value={editModal.product.pricePerKg || editModal.product.price || 0}
                    onChange={(e) => handleEditChange('pricePerKg', e.target.value)}
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
                    value={editModal.product.stock || 0}
                    onChange={(e) => handleEditChange('stock', e.target.value)}
                    className="pl-modal-input"
                    step="0.1"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="pl-form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editModal.product.featured || false}
                    onChange={(e) => handleEditChange('featured', e.target.checked)}
                  />
                  <span className="custom-checkbox"></span>
                  <span className="checkbox-text">⭐ Ana səhifədə göstər</span>
                </label>
                <small className="pl-field-hint">İşarələsəniz, məhsul ana səhifədə görünəcək</small>
              </div>

              <div className="pl-form-group">
                <label>Sıra nömrəsi</label>
                <input
                  type="number"
                  value={editModal.product.order || 0}
                  onChange={(e) => handleEditChange('order', parseInt(e.target.value) || 0)}
                  className="pl-modal-input"
                  min="0"
                  placeholder="Sıra nömrəsi (kiçik rəqəm öndə)"
                />
                <small className="pl-field-hint">Ana səhifədə sıralama üçün (1, 2, 3...)</small>
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

                  {(editModal.product.img || editModal.product.image) && (
                    <div className="pl-image-preview">
                      <img 
                        src={editModal.product.img || editModal.product.image} 
                        alt="Preview" 
                        className="pl-preview-image"
                      />
                      <button 
                        className="pl-remove-image-btn"
                        onClick={() => handleEditChange('img', null)}
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
              {(imageModal.product.img || imageModal.product.image) ? (
                <img 
                  src={imageModal.product.img || imageModal.product.image} 
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
                ID: <strong>{String(deleteModal.productId)}</strong>
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

      {/* Stok İdarəsi Modali */}
      {stockModal.show && (
        <StockManagement
          product={stockModal.product}
          onClose={() => setStockModal({ show: false, product: null })}
          onUpdateStock={handleUpdateStock}
          stockMovements={stockMovements}
        />
      )}
    </div>
  );
};

export default ProductList;