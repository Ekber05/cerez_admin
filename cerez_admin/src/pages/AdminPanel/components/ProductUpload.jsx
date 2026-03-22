import React, { useState, useRef } from 'react';
import { useProducts } from '../../../contexts/ProductContext';
import './ProductUpload.css';

const ProductUpload = () => {
  const { addProduct, products } = useProducts();

  // BİLDİRİŞ STATE
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: 'Çərəzlər'
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  // File seçimi zamanı onClick-in işləməsinin qarşısını almaq üçün flag
  const isFileDialogOpen = useRef(false);

  // BİLDİRİŞ GÖSTƏR
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    
    if (selectedFiles.length + fileArray.length > 5) {
      showToast('Maksimum 5 şəkil yükləyə bilərsiniz!', 'error');
      return;
    }

    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        showToast(`"${file.name}" şəkil formatında deyil!`, 'error');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`"${file.name}" 5MB-dan böyükdür!`, 'error');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(prev => [...prev, ...validFiles]);

    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleFileChange = (e) => {
    // File seçildi, flag-ı bağla
    isFileDialogOpen.current = false;
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    
    // Input-un value-sunu təmizlə ki, eyni faylı təkrar seçmək mümkün olsun
    e.target.value = '';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const generateProductId = () => {
    const lastId = products.length > 0 
      ? Math.max(...products.map(p => parseInt(p.id.replace('QM-', ''))))
      : 0;
    const newId = lastId + 1;
    return `QM-${String(newId).padStart(3, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      showToast('Ən azı 1 şəkil yükləməlisiniz!', 'error');
      return;
    }

    if (!formData.name || !formData.price || !formData.stock) {
      showToast('Bütün məcburi sahələri doldurun!', 'error');
      return;
    }

    const newProduct = {
      id: generateProductId(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description || '',
      image: selectedFiles.length > 0 ? previewUrls[0] : null,
      unit: 'kq'
    };

    addProduct(newProduct);
    handleCancel();
    showToast('Məhsul əlavə edildi', 'success');
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      price: '',
      stock: '',
      description: '',
      category: 'Çərəzlər'
    });
    
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const openFileDialog = (e) => {
    // Əgər flag açıqdırsa, onClick işləməsin
    if (isFileDialogOpen.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Flag-ı aç
    isFileDialogOpen.current = true;
    
    // File input-u aç
    fileInputRef.current.click();
  };

  // File input-a click üçün ayrıca handler
  const handleInputClick = (e) => {
    e.stopPropagation(); // Event-in yuxarıya yayılmasının qarşısını al
  };

  return (
    <div className="productupload-wrapper">
      <div className="productupload-container">
        
        {/* SADƏ AĞ BİLDİRİŞ PƏNCƏRƏSİ */}
        {toast.show && (
          <div className={`simple-notification ${toast.type}`}>
            <div className="notification-content">
              <span className="notification-message">{toast.message}</span>
            </div>
            <button 
              className="notification-close"
              onClick={() => setToast({ show: false, message: '', type: '' })}
            >
              ×
            </button>
          </div>
        )}

        <h1 className="productupload-title">Məhsul Yüklə</h1>
        
        <div className="productupload-card">
          <div className="productupload-header">
            <h2>Yeni Məhsul Əlavə Et</h2>
            <span className="productupload-badge">Maksimum 5 şəkil</span>
          </div>
          
          {/* Şəkil yükləmə sahəsi */}
          <div 
            className={`productupload-area ${dragActive ? 'drag-active' : ''} ${selectedFiles.length > 0 ? 'has-images' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              onClick={handleInputClick}
              className="productupload-file-input"
              accept="image/*"
              multiple
            />
            
            {selectedFiles.length > 0 ? (
              <div className="productupload-preview-grid">
                {previewUrls.map((url, index) => (
                  <div key={index} className="productupload-preview-item">
                    <img src={url} alt={`Preview ${index + 1}`} />
                    <button 
                      type="button" 
                      className="productupload-remove-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      ×
                    </button>
                    <span className="productupload-image-order">{index + 1}</span>
                  </div>
                ))}
                
                {selectedFiles.length < 5 && (
                  <div 
                    className="productupload-add-more" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog(e);
                    }}
                  >
                    <span>+</span>
                    <small>Əlavə et</small>
                  </div>
                )}
              </div>
            ) : (
              <div className="productupload-upload-prompt">
                <div className="productupload-icon">📸</div>
                <p className="productupload-main-text">Şəkilləri seçin və ya bura dartın</p>
                <p className="productupload-hint">JPG, PNG, GIF • Maksimum 5MB • 5 şəkilə qədər</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="productupload-form">
            <div className="productupload-form-row">
              <div className="productupload-form-group">
                <label>Məhsul Adı <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Məsələn: Badam, Qoz, Fındıq..."
                  required
                />
              </div>
            </div>

            <div className="productupload-form-row">
              <div className="productupload-form-group">
                <label>Kateqoriya <span className="required">*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="productupload-select"
                  required
                >
                  <option value="Çərəzlər">Çərəzlər</option>
                  <option value="Quru meyvələr">Quru meyvələr</option>
                </select>
              </div>
            </div>

            <div className="productupload-form-row">
              <div className="productupload-form-group">
                <label>Qiymət (₼) <span className="required">*</span></label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="productupload-form-group">
                <label>Stok miqdarı (kq) <span className="required">*</span></label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="productupload-form-group productupload-full-width">
              <label>Açıqlama <span className="optional">(istəyə bağlı)</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Məhsul haqqında məlumat: çeşid, keyfiyyət, mənşə ölkəsi..."
                rows="4"
              />
            </div>

            <div className="productupload-form-actions">
              <button 
                type="button" 
                className="productupload-btn-secondary"
                onClick={handleCancel}
              >
                Ləğv Et
              </button>
              <button type="submit" className="productupload-btn-primary">
                Məhsulu Yüklə
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpload;