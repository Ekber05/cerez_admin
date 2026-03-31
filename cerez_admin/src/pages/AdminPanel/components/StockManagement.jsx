// StockManagement.jsx - autoFocus silindi
import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiAlertCircle, FiPackage, FiX, FiCheck, FiClock, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import './StockManagement.css';

const StockManagement = ({ product, onClose, onUpdateStock, stockMovements = [] }) => {
  const [activeTab, setActiveTab] = useState('add');
  const [addQuantity, setAddQuantity] = useState('');
  const [addNote, setAddNote] = useState('');
  const [reduceQuantity, setReduceQuantity] = useState('');
  const [reduceNote, setReduceNote] = useState('');
  const [alertThreshold, setAlertThreshold] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // Ref-lər
  const addInputRef = useRef(null);
  const reduceInputRef = useRef(null);
  const noteInputRef = useRef(null);
  const thresholdInputRef = useRef(null);

  // Zoom-un qarşısını almaq üçün input focus hadisəsi
  const handleInputFocus = (e) => {
    // Input-un font-size-ni müvəqqəti 16px et
    const originalFontSize = window.getComputedStyle(e.target).fontSize;
    if (parseInt(originalFontSize) < 16) {
      e.target.style.fontSize = '16px';
      // Focus itirdikdə köhnə ölçüyə qaytar
      e.target.addEventListener('blur', () => {
        e.target.style.fontSize = originalFontSize;
      }, { once: true });
    }
  };

  // Stok statusu
  const getStockStatus = (stock) => {
    if (stock <= 0) {
      return { class: 'stock-critical', text: 'Bitib!', icon: '🔴', level: 'critical' };
    } else if (stock <= alertThreshold) {
      return { class: 'stock-low', text: 'Az qalıb', icon: '🟡', level: 'low' };
    } else if (stock <= alertThreshold * 2) {
      return { class: 'stock-medium', text: 'Normal', icon: '🟢', level: 'medium' };
    }
    return { class: 'stock-high', text: 'Çoxdur', icon: '✅', level: 'high' };
  };

  const stockStatus = getStockStatus(product.stock);

  // Bildiriş göstər
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Stok əlavə et
  const handleAddStock = async () => {
    const quantity = parseFloat(addQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      showNotification('Zəhmət olmasa düzgün miqdar daxil edin!', 'error');
      return;
    }

    setIsLoading(true);
    
    const newStock = product.stock + quantity;
    const movement = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      type: 'in',
      quantity: quantity,
      reason: addNote || 'Stok əlavə edildi',
      date: new Date().toISOString(),
      admin: localStorage.getItem('adminName') || 'Admin',
      oldStock: product.stock,
      newStock: newStock
    };

    await onUpdateStock(product.id, newStock, movement);
    
    setAddQuantity('');
    setAddNote('');
    setIsLoading(false);
    
    showNotification(`✅ ${quantity} kq stok uğurla əlavə edildi!`, 'success');
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Stok azalt
  const handleReduceStock = async () => {
    const quantity = parseFloat(reduceQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      showNotification('Zəhmət olmasa düzgün miqdar daxil edin!', 'error');
      return;
    }
    if (quantity > product.stock) {
      showNotification(`Stokda cəmi ${product.stock} kq var! ${quantity} kq azalda bilməzsiniz.`, 'error');
      return;
    }

    setIsLoading(true);
    
    const newStock = product.stock - quantity;
    const movement = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      type: 'out',
      quantity: quantity,
      reason: reduceNote || 'Stok çıxarışı',
      date: new Date().toISOString(),
      admin: localStorage.getItem('adminName') || 'Admin',
      oldStock: product.stock,
      newStock: newStock
    };

    await onUpdateStock(product.id, newStock, movement);
    
    setReduceQuantity('');
    setReduceNote('');
    setIsLoading(false);
    
    showNotification(`⚠️ ${quantity} kq stok azaldıldı!`, 'warning');
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Xəbərdarlıq limitini dəyiş
  const handleUpdateThreshold = () => {
    localStorage.setItem(`stock_threshold_${product.id}`, alertThreshold);
    showNotification(`⚙️ Xəbərdarlıq limiti ${alertThreshold} kq olaraq təyin edildi!`, 'success');
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  // Yüklənmiş threshold-u oxu
  useEffect(() => {
    const savedThreshold = localStorage.getItem(`stock_threshold_${product.id}`);
    if (savedThreshold) {
      setAlertThreshold(parseInt(savedThreshold));
    }
  }, [product.id]);

  return (
    <div className="stock-modal-overlay" onClick={onClose}>
      <div className="stock-modal-content" onClick={e => e.stopPropagation()}>
        {/* Bildiriş */}
        {notification.show && (
          <div className={`stock-notification stock-notification-${notification.type}`}>
            <div className="stock-notification-content">
              {notification.type === 'success' && <FiCheck />}
              {notification.type === 'warning' && <FiAlertCircle />}
              {notification.type === 'error' && <FiAlertCircle />}
              <span>{notification.message}</span>
            </div>
            <button 
              className="stock-notification-close" 
              onClick={() => setNotification({ show: false, message: '', type: 'success' })}
            >
              <FiX />
            </button>
          </div>
        )}

        <div className="stock-modal-header">
          <div className="stock-modal-title">
            <FiPackage className="stock-modal-icon" />
            <h3>Stok İdarəsi: {product.name}</h3>
          </div>
          <button className="stock-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Tab menyusu */}
        <div className="stock-tabs">
          <button 
            className={`stock-tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            <FiPlus /> Stok Əlavə Et
          </button>
          <button 
            className={`stock-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FiClock /> Stok Tarixçəsi
          </button>
          <button 
            className={`stock-tab ${activeTab === 'alert' ? 'active' : ''}`}
            onClick={() => setActiveTab('alert')}
          >
            <FiAlertCircle /> Xəbərdarlıq
          </button>
        </div>

        <div className="stock-modal-body">
          {/* Cari Stok Məlumatı */}
          <div className="stock-current-info">
            <div className="stock-info-card">
              <span className="stock-info-label">Cari Stok:</span>
              <span className={`stock-info-value ${stockStatus.class}`}>
                {stockStatus.icon} {product.stock} kq
              </span>
            </div>
            <div className="stock-info-card">
              <span className="stock-info-label">Status:</span>
              <span className={`stock-status-badge ${stockStatus.class}`}>
                {stockStatus.text}
              </span>
            </div>
          </div>

          {/* Tab 1: Stok Əlavə Et və Azalt */}
          {activeTab === 'add' && (
            <div className="stock-tab-content">
              {/* Stok Əlavə Et Bölməsi */}
              <div className="stock-add-section">
                <h4>📦 Stok Əlavə Et</h4>
                
                <div className="stock-form-group">
                  <label>Əlavə ediləcək miqdar (kq):</label>
                  <div className="stock-quantity-wrapper">
                    <input
                      ref={addInputRef}
                      type="number"
                      className="stock-quantity-input"
                      value={addQuantity}
                      onChange={(e) => setAddQuantity(e.target.value)}
                      placeholder="Miqdar"
                      step="0.1"
                      min="0"
                      // autoFocus SİLİNDİ
                      onFocus={handleInputFocus}
                    />
                    <div className="stock-quick-buttons">
                      <button className="stock-quick-btn" onClick={() => setAddQuantity((parseFloat(addQuantity) + 10).toString())}>+10</button>
                      <button className="stock-quick-btn" onClick={() => setAddQuantity((parseFloat(addQuantity) + 50).toString())}>+50</button>
                      <button className="stock-quick-btn" onClick={() => setAddQuantity((parseFloat(addQuantity) + 100).toString())}>+100</button>
                    </div>
                  </div>
                  <span className={`stock-calc-hint ${parseFloat(addQuantity) > 0 ? 'stock-success' : ''}`}>
                    Cari: {product.stock} kq → Yeni: {(product.stock + (parseFloat(addQuantity) || 0)).toFixed(2)} kq
                  </span>
                </div>

                <div className="stock-form-group">
                  <label>Qeyd (istəyə bağlı):</label>
                  <input
                    ref={noteInputRef}
                    type="text"
                    className="stock-note-input"
                    value={addNote}
                    onChange={(e) => setAddNote(e.target.value)}
                    placeholder="Məsələn: Yeni mal gəldi, təchizatçı: Badamçı MMC"
                    onFocus={handleInputFocus}
                  />
                </div>

                <div className="stock-form-actions">
                  <button className="stock-btn stock-btn-secondary" onClick={onClose}>
                    Ləğv et
                  </button>
                  <button 
                    className="stock-btn stock-btn-primary" 
                    onClick={handleAddStock}
                    disabled={isLoading || !addQuantity}
                  >
                    {isLoading ? 'Əlavə edilir...' : '✅ Stok Əlavə Et'}
                  </button>
                </div>
              </div>

              {/* Stok Azalt Bölməsi */}
              <div className="stock-divider">
                <span>və ya</span>
              </div>

              <div className="stock-reduce-section">
                <h4>⚠️ Stok Azalt</h4>
                
                <div className="stock-form-group">
                  <label>Azaldılacaq miqdar (kq):</label>
                  <div className="stock-quantity-wrapper">
                    <input
                      ref={reduceInputRef}
                      type="number"
                      className="stock-quantity-input"
                      value={reduceQuantity}
                      onChange={(e) => setReduceQuantity(e.target.value)}
                      placeholder="Miqdar"
                      step="0.1"
                      min="0"
                      onFocus={handleInputFocus}
                    />
                    <div className="stock-quick-buttons">
                      <button className="stock-quick-btn" onClick={() => setReduceQuantity((parseFloat(reduceQuantity) + 5).toString())}>+5</button>
                      <button className="stock-quick-btn" onClick={() => setReduceQuantity((parseFloat(reduceQuantity) + 10).toString())}>+10</button>
                      <button className="stock-quick-btn" onClick={() => setReduceQuantity((parseFloat(reduceQuantity) + 20).toString())}>+20</button>
                    </div>
                  </div>
                  <span className={`stock-calc-hint ${parseFloat(reduceQuantity) > product.stock ? 'stock-warning' : ''}`}>
                    Cari: {product.stock} kq → Yeni: {Math.max(0, product.stock - (parseFloat(reduceQuantity) || 0)).toFixed(2)} kq
                  </span>
                </div>

                <div className="stock-form-group">
                  <label>Azaltma səbəbi (istəyə bağlı):</label>
                  <input
                    type="text"
                    className="stock-note-input"
                    value={reduceNote}
                    onChange={(e) => setReduceNote(e.target.value)}
                    placeholder="Məsələn: Zədəli məhsul, vaxtı keçmiş, inventarizasiya"
                    onFocus={handleInputFocus}
                  />
                </div>

                <div className="stock-form-actions">
                  <button 
                    className="stock-btn stock-btn-danger" 
                    onClick={handleReduceStock}
                    disabled={isLoading || !reduceQuantity || parseFloat(reduceQuantity) > product.stock}
                  >
                    {isLoading ? 'Azaldılır...' : '⚠️ Stok Azalt'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Stok Tarixçəsi */}
          {activeTab === 'history' && (
            <div className="stock-tab-content">
              <h4>📋 Stok Hərəkətləri Tarixçəsi</h4>
              
              {stockMovements.filter(m => m.productId === product.id).length === 0 ? (
                <div className="stock-empty-history">
                  <FiClock size={40} />
                  <p>Hələ heç bir stok hərəkəti yoxdur</p>
                  <small>Stok əlavə etdikdə burada görünəcək</small>
                </div>
              ) : (
                <div className="stock-movements-list">
                  {stockMovements
                    .filter(m => m.productId === product.id)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(movement => (
                      <div key={movement.id} className={`stock-movement-item ${movement.type}`}>
                        <div className="movement-icon">
                          {movement.type === 'in' ? <FiTrendingUp /> : <FiTrendingDown />}
                        </div>
                        <div className="movement-details">
                          <div className="movement-header">
                            <span className="movement-type">
                              {movement.type === 'in' ? '📦 Stok əlavə' : '🛒 Stok çıxarış'}
                            </span>
                            <span className="movement-date">
                              {new Date(movement.date).toLocaleString('az-AZ')}
                            </span>
                          </div>
                          <div className="movement-quantity">
                            <span className={`quantity ${movement.type === 'in' ? 'positive' : 'negative'}`}>
                              {movement.type === 'in' ? `+${movement.quantity}` : `-${movement.quantity}`} kq
                            </span>
                            <span className="movement-stock-change">
                              ({movement.oldStock} → {movement.newStock} kq)
                            </span>
                          </div>
                          <div className="movement-reason">
                            <span className="reason-label">Səbəb:</span>
                            <span className="reason-text">{movement.reason}</span>
                          </div>
                          <div className="movement-admin">
                            <span className="admin-label">Admin:</span>
                            <span className="admin-text">{movement.admin}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Xəbərdarlıq */}
          {activeTab === 'alert' && (
            <div className="stock-tab-content">
              <h4>⚠️ Stok Xəbərdarlıq Ayarları</h4>
              
              <div className="stock-alert-section">
                <div className="stock-status-display">
                  <div className={`stock-alert-status ${stockStatus.level}`}>
                    <div className="alert-icon">{stockStatus.icon}</div>
                    <div className="alert-info">
                      <div className="alert-title">Cari Stok Vəziyyəti</div>
                      <div className="alert-stock">{product.stock} kq</div>
                      <div className="alert-status">{stockStatus.text}</div>
                    </div>
                  </div>
                </div>

                <div className="stock-form-group">
                  <label>Xəbərdarlıq limiti (kq):</label>
                  <div className="threshold-input-group">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={alertThreshold}
                      onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                      className="threshold-slider"
                    />
                    <input
                      ref={thresholdInputRef}
                      type="number"
                      value={alertThreshold}
                      onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                      className="threshold-number"
                      min="1"
                      max="100"
                      onFocus={handleInputFocus}
                    />
                  </div>
                  <small className="stock-calc-hint">
                    Stok bu limitə düşdükdə xəbərdarlıq göstəriləcək
                  </small>
                </div>

                <button className="stock-btn stock-btn-primary" onClick={handleUpdateThreshold}>
                  <FiCheck /> Limitləri Yadda Saxla
                </button>

                {/* Xəbərdarlıq göstəriciləri */}
                <div className="stock-alert-levels">
                  <div className="alert-level">
                    <div className="level-color critical"></div>
                    <span>Kritik (0 kq)</span>
                    <small>Dərhal stok əlavə edin!</small>
                  </div>
                  <div className="alert-level">
                    <div className="level-color low"></div>
                    <span>Aşağı (≤ {alertThreshold} kq)</span>
                    <small>Tezliklə stok əlavə edin</small>
                  </div>
                  <div className="alert-level">
                    <div className="level-color medium"></div>
                    <span>Normal (≤ {alertThreshold * 2} kq)</span>
                    <small>İzləmədə saxlayın</small>
                  </div>
                  <div className="alert-level">
                    <div className="level-color high"></div>
                    <span>Yüksək (&gt; {alertThreshold * 2} kq)</span>
                    <small>Stok kifayət qədərdir</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockManagement;