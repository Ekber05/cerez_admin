import React, { useState, useRef, useEffect } from 'react';
import './Campaigns.css';

const Campaigns = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEndConfirmModal, setShowEndConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [campaignToEnd, setCampaignToEnd] = useState(null);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  
  // Dropdown states
  const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);
  const [isApplyToDropdownOpen, setIsApplyToDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  
  // Dropdown refs
  const discountDropdownRef = useRef(null);
  const applyToDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  
  // Məhsul axtarış və əlavə etmə üçün state
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [customProduct, setCustomProduct] = useState('');
  
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Yay Endirimi',
      description: 'Bütün quru meyvələrdə 20% endirim',
      discountType: 'percentage',
      discountValue: 20,
      startDate: '2024-06-01',
      endDate: '2024-06-15',
      status: 'active',
      applyTo: 'all',
      banner: '/images/summer-campaign.jpg',
      promoCode: 'YAY20',
      usageLimit: 100,
      stats: {
        orders: 45,
        productsSold: 128,
        revenue: 1250.50
      }
    },
    {
      id: 2,
      name: 'Yeni Müştəri',
      description: 'İlk alış-verişə 10% endirim',
      discountType: 'percentage',
      discountValue: 10,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      applyTo: 'products',
      products: ['Qoz ləpəsi', 'Badam ləpəsi', 'Findıq ləpəsi'],
      banner: '/images/new-customer.jpg',
      promoCode: 'XOSGELDIN10',
      usageLimit: 500,
      stats: {
        orders: 89,
        productsSold: 156,
        revenue: 2340.75
      }
    },
    {
      id: 3,
      name: '2 al 1 pulsuz',
      description: 'Badam al, findıq pulsuz',
      discountType: 'fixed',
      discountValue: 15,
      startDate: '2024-05-15',
      endDate: '2024-05-30',
      status: 'inactive',
      applyTo: 'products',
      products: ['Badam', 'Findıq'],
      banner: '/images/buy2get1.jpg',
      stats: {
        orders: 23,
        productsSold: 67,
        revenue: 890.25
      }
    },
    {
      id: 4,
      name: 'Ramazan Kampaniyası',
      description: 'Ramazan ayı xüsusi endirimləri',
      discountType: 'percentage',
      discountValue: 15,
      startDate: '2024-03-10',
      endDate: '2024-04-09',
      status: 'completed',
      applyTo: 'all',
      banner: '/images/ramadan.jpg',
      promoCode: 'RAMAZAN15',
      usageLimit: 300,
      stats: {
        orders: 156,
        productsSold: 423,
        revenue: 5678.90
      }
    }
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Yeni kampaniya üçün form state
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    status: 'active',
    applyTo: 'all',
    products: [],
    banner: '',
    bannerFile: null,
    bannerPreview: '',
    promoCode: '',
    usageLimit: '',
    hasPromoCode: false
  });

  const discountTypes = [
    { value: 'percentage', label: 'Faiz endirimi (%)', icon: 'fa-percent', description: 'Məhsul qiymətinə faizlə endirim' },
    { value: 'fixed', label: 'Sabit məbləğ (AZN)', icon: 'fa-money-bill-wave', description: 'Məhsul qiymətindən sabit məbləğ endirimi' }
  ];

  const applyToOptions = [
    { value: 'all', label: 'Bütün məhsullar', icon: 'fa-boxes', description: 'Bütün məhsullara eyni endirim tətbiq olunur' },
    { value: 'products', label: 'Məhsullar', icon: 'fa-cube', description: 'Yalnız seçilmiş məhsullara endirim' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Aktiv', icon: 'fa-check-circle', description: 'Kampaniya aktiv və istifadə edilə bilər' },
    { value: 'inactive', label: 'Deaktiv', icon: 'fa-pause-circle', description: 'Kampaniya müvəqqəti dayandırılıb' }
  ];

  // Dropdown-ı bağlamaq üçün klik hadisəsi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (discountDropdownRef.current && !discountDropdownRef.current.contains(event.target)) {
        setIsDiscountDropdownOpen(false);
      }
      if (applyToDropdownRef.current && !applyToDropdownRef.current.contains(event.target)) {
        setIsApplyToDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCampaign({
          ...newCampaign,
          bannerFile: file,
          bannerPreview: reader.result,
          banner: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = () => {
    setNewCampaign({
      ...newCampaign,
      bannerFile: null,
      bannerPreview: '',
      banner: ''
    });
  };

  // Məhsul əlavə et
  const handleAddProduct = () => {
    if (customProduct.trim() && !newCampaign.products.includes(customProduct.trim())) {
      setNewCampaign({
        ...newCampaign,
        products: [...newCampaign.products, customProduct.trim()]
      });
      setCustomProduct('');
    }
  };

  // Məhsul sil
  const handleRemoveProduct = (productToRemove) => {
    setNewCampaign({
      ...newCampaign,
      products: newCampaign.products.filter(p => p !== productToRemove)
    });
  };

  // Enter düyməsi ilə məhsul əlavə et
  const handleProductKeyPress = (e) => {
    if (e.key === 'Enter' && customProduct.trim()) {
      e.preventDefault();
      handleAddProduct();
    }
  };

  const handleCreateCampaign = () => {
    const campaign = {
      id: campaigns.length + 1,
      ...newCampaign,
      discountValue: parseFloat(newCampaign.discountValue),
      usageLimit: newCampaign.usageLimit ? parseInt(newCampaign.usageLimit) : null,
      stats: { orders: 0, productsSold: 0, revenue: 0 }
    };
    setCampaigns([...campaigns, campaign]);
    setShowCreateModal(false);
    setNewCampaign({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
      status: 'active',
      applyTo: 'all',
      products: [],
      banner: '',
      bannerFile: null,
      bannerPreview: '',
      promoCode: '',
      usageLimit: '',
      hasPromoCode: false
    });
  };

  const handleDeleteCampaign = () => {
    if (campaignToDelete) {
      setCampaigns(campaigns.filter(c => c.id !== campaignToDelete));
      setShowDeleteConfirmModal(false);
      setCampaignToDelete(null);
    }
  };

  const handleToggleStatus = (id) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ));
  };

  const handleEndNow = () => {
    if (campaignToEnd) {
      const today = new Date().toISOString().split('T')[0];
      setCampaigns(campaigns.map(c => 
        c.id === campaignToEnd ? { ...c, endDate: today, status: 'completed' } : c
      ));
      setShowEndConfirmModal(false);
      setCampaignToEnd(null);
    }
  };

  const openEndConfirmModal = (id) => {
    setCampaignToEnd(id);
    setShowEndConfirmModal(true);
  };

  const openDeleteConfirmModal = (id) => {
    setCampaignToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setNewCampaign({
      ...campaign,
      bannerPreview: campaign.banner,
      hasPromoCode: !!campaign.promoCode
    });
    setShowCreateModal(true);
  };

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowEndConfirmModal(false);
    setShowDeleteConfirmModal(false);
    setCampaignToEnd(null);
    setCampaignToDelete(null);
    setSelectedCampaign(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedCampaign(null);
    setNewCampaign({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
      status: 'active',
      applyTo: 'all',
      products: [],
      banner: '',
      bannerFile: null,
      bannerPreview: '',
      promoCode: '',
      usageLimit: '',
      hasPromoCode: false
    });
    setProductSearchTerm('');
    setCustomProduct('');
  };

  const closeEndModal = () => {
    setShowEndConfirmModal(false);
    setCampaignToEnd(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirmModal(false);
    setCampaignToDelete(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <span className="status-badge active">Aktiv</span>;
      case 'inactive': return <span className="status-badge inactive">Deaktiv</span>;
      case 'completed': return <span className="status-badge completed">Bitmiş</span>;
      default: return null;
    }
  };

  const getDiscountDisplay = (campaign) => {
    if (campaign.discountType === 'percentage') {
      return `${campaign.discountValue}%`;
    } else {
      return `${campaign.discountValue} AZN`;
    }
  };

  // Seçilmiş dəyərlərin label-nı tap
  const getSelectedDiscountLabel = () => {
    const selected = discountTypes.find(type => type.value === newCampaign.discountType);
    return selected ? selected.label : 'Endirim növü seçin';
  };

  const getSelectedApplyToLabel = () => {
    const selected = applyToOptions.find(opt => opt.value === newCampaign.applyTo);
    return selected ? selected.label : 'Tətbiq sahəsi seçin';
  };

  const getSelectedStatusLabel = () => {
    const selected = statusOptions.find(opt => opt.value === newCampaign.status);
    return selected ? selected.label : 'Status seçin';
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchTerm === '' || 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleSelectDiscountType = (value) => {
    setNewCampaign({...newCampaign, discountType: value});
    setIsDiscountDropdownOpen(false);
  };

  const handleSelectApplyTo = (value) => {
    setNewCampaign({...newCampaign, applyTo: value, products: []});
    setIsApplyToDropdownOpen(false);
  };

  const handleSelectStatus = (value) => {
    setNewCampaign({...newCampaign, status: value});
    setIsStatusDropdownOpen(false);
  };

  return (
    <div className="campaigns-container">
      <div className="campaigns-header">
        <h1>Kampaniyalar</h1>
        <button 
          type="button"
          className="create-button"
          onClick={() => {
            setSelectedCampaign(null);
            setNewCampaign({
              name: '',
              description: '',
              discountType: 'percentage',
              discountValue: '',
              startDate: '',
              endDate: '',
              status: 'active',
              applyTo: 'all',
              products: [],
              banner: '',
              bannerFile: null,
              bannerPreview: '',
              promoCode: '',
              usageLimit: '',
              hasPromoCode: false
            });
            setShowCreateModal(true);
          }}
        >
          <i className="fas fa-plus"></i>
          Yeni Kampaniya
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Kampaniya axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          {searchTerm && (
            <button 
              type="button"
              className="search-clear"
              onClick={clearSearch}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <div className="status-filters">
          <button 
            type="button"
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}
          >
            Hamısı ({campaigns.length})
          </button>
          <button 
            type="button"
            className={filterStatus === 'active' ? 'active' : ''}
            onClick={() => setFilterStatus('active')}
          >
            Aktiv ({campaigns.filter(c => c.status === 'active').length})
          </button>
          <button 
            type="button"
            className={filterStatus === 'inactive' ? 'active' : ''}
            onClick={() => setFilterStatus('inactive')}
          >
            Deaktiv ({campaigns.filter(c => c.status === 'inactive').length})
          </button>
          <button 
            type="button"
            className={filterStatus === 'completed' ? 'active' : ''}
            onClick={() => setFilterStatus('completed')}
          >
            Bitmiş ({campaigns.filter(c => c.status === 'completed').length})
          </button>
        </div>
      </div>

      {searchTerm && (
        <div className="search-results-info">
          <p>
            <i className="fas fa-search"></i> 
            "{searchTerm}" üçün {filteredCampaigns.length} nəticə tapıldı
          </p>
        </div>
      )}

      {filteredCampaigns.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <h3>Heç bir kampaniya tapılmadı</h3>
          <p>Axtarış şərtlərinizi dəyişdirin və ya yeni kampaniya yaradın</p>
          <button 
            type="button"
            className="create-button-small"
            onClick={() => {
              setSelectedCampaign(null);
              setNewCampaign({
                name: '',
                description: '',
                discountType: 'percentage',
                discountValue: '',
                startDate: '',
                endDate: '',
                status: 'active',
                applyTo: 'all',
                products: [],
                banner: '',
                bannerFile: null,
                bannerPreview: '',
                promoCode: '',
                usageLimit: '',
                hasPromoCode: false
              });
              setShowCreateModal(true);
            }}
          >
            <i className="fas fa-plus"></i>
            Yeni Kampaniya
          </button>
        </div>
      ) : (
        <div className="campaigns-grid">
          {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-banner" style={{backgroundImage: `url(${campaign.banner})`}}>
                {campaign.promoCode && (
                  <div className="promo-code-badge">
                    {campaign.promoCode}
                  </div>
                )}
              </div>
              <div className="campaign-content">
                <div className="campaign-header">
                  <h3>{campaign.name}</h3>
                  {getStatusBadge(campaign.status)}
                </div>
                <p className="campaign-description">{campaign.description}</p>
                
                <div className="campaign-details">
                  <div className="detail-item">
                    <i className="fas fa-tag"></i>
                    <span>Endirim: <strong>{getDiscountDisplay(campaign)}</strong></span>
                  </div>
                  <div className="detail-item">
                    <i className="far fa-calendar"></i>
                    <span>
                      {new Date(campaign.startDate).toLocaleDateString('az-AZ')} - 
                      {new Date(campaign.endDate).toLocaleDateString('az-AZ')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Tətbiq: {
                      campaign.applyTo === 'all' ? 'Bütün məhsullar' :
                      `${campaign.products?.length || 0} Məhsul`
                    }</span>
                  </div>
                </div>

                <div className="campaign-actions">
                  <button 
                    type="button"
                    className="edit-btn"
                    onClick={() => handleEditCampaign(campaign)}
                  >
                    <i className="fas fa-edit"></i>
                    Redaktə
                  </button>
                  <button 
                    type="button"
                    className="status-btn"
                    onClick={() => handleToggleStatus(campaign.id)}
                  >
                    <i className={`fas fa-${campaign.status === 'active' ? 'pause' : 'play'}`}></i>
                    {campaign.status === 'active' ? 'Deaktiv et' : 'Aktiv et'}
                  </button>
                  {campaign.status === 'active' && (
                    <button 
                      type="button"
                      className="end-now-btn"
                      onClick={() => openEndConfirmModal(campaign.id)}
                      title="Kampaniyanı dərhal bitir"
                    >
                      <i className="fas fa-clock"></i>
                      Bitir
                    </button>
                  )}
                  <button 
                    type="button"
                    className="delete-btn"
                    onClick={() => openDeleteConfirmModal(campaign.id)}
                  >
                    <i className="fas fa-trash"></i>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yeni kampaniya yaratma modali */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="campaign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="campaign-modal-header">
              <h2>{selectedCampaign ? 'Kampaniyanı redaktə et' : 'Yeni kampaniya yarat'}</h2>
              <button 
                type="button"
                className="campaign-modal-close" 
                onClick={closeCreateModal}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="campaign-modal-body">
              {/* Banner yükləmə bölməsi */}
              <div className="banner-upload-section">
                <label className="banner-upload-label">Kampaniya şəkli</label>
                <div className="banner-upload-area">
                  {newCampaign.bannerPreview ? (
                    <div className="banner-preview">
                      <img src={newCampaign.bannerPreview} alt="Banner preview" />
                      <button 
                        type="button"
                        className="remove-banner-btn"
                        onClick={handleRemoveBanner}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <input 
                        type="file"
                        id="banner-upload"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="file-input"
                      />
                      <label htmlFor="banner-upload" className="upload-label">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Şəkil yükləmək üçün klikləyin</span>
                        <span className="upload-hint">PNG, JPG və ya GIF (max. 5MB)</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="campaign-form-grid">
                <div className="form-group full-width">
                  <label>Kampaniya adı *</label>
                  <input 
                    type="text" 
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    placeholder="Məs: Yay Endirimi 2024"
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Təsvir</label>
                  <textarea 
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                    placeholder="Kampaniya haqqında qısa məlumat"
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label>Başlama tarixi *</label>
                  <input 
                    type="date" 
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Bitmə tarixi *</label>
                  <input 
                    type="date" 
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                    className="form-input"
                  />
                </div>

                {/* Endirim növü dropdown */}
                <div className="form-group">
                  <label>Endirim növü</label>
                  <div className="custom-dropdown" ref={discountDropdownRef}>
                    <button 
                      type="button"
                      className={`dropdown-header ${isDiscountDropdownOpen ? 'active' : ''}`}
                      onClick={() => setIsDiscountDropdownOpen(!isDiscountDropdownOpen)}
                    >
                      <div className="selected-option">
                        <i className={`fas ${discountTypes.find(t => t.value === newCampaign.discountType)?.icon || 'fa-tag'}`}></i>
                        <span>{getSelectedDiscountLabel()}</span>
                      </div>
                      <i className={`fas fa-chevron-${isDiscountDropdownOpen ? 'up' : 'down'}`}></i>
                    </button>
                    
                    {isDiscountDropdownOpen && (
                      <div className="dropdown-menu">
                        {discountTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            className={`dropdown-item ${newCampaign.discountType === type.value ? 'selected' : ''}`}
                            onClick={() => handleSelectDiscountType(type.value)}
                          >
                            <div className="option-icon">
                              <i className={`fas ${type.icon}`}></i>
                            </div>
                            <div className="option-content">
                              <span className="option-title">{type.label}</span>
                              <span className="option-description">{type.description}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Endirim dəyəri *</label>
                  <div className="input-with-suffix">
                    <input 
                      type="number" 
                      value={newCampaign.discountValue}
                      onChange={(e) => setNewCampaign({...newCampaign, discountValue: e.target.value})}
                      placeholder={newCampaign.discountType === 'percentage' ? '20' : '5'}
                      min="0"
                      step={newCampaign.discountType === 'percentage' ? '1' : '0.01'}
                      className="form-input"
                    />
                    <span className="input-suffix">
                      {newCampaign.discountType === 'percentage' ? '%' : 'AZN'}
                    </span>
                  </div>
                </div>

                {/* Tətbiq sahəsi dropdown */}
                <div className="form-group full-width">
                  <label>Tətbiq sahəsi</label>
                  <div className="custom-dropdown" ref={applyToDropdownRef}>
                    <button 
                      type="button"
                      className={`dropdown-header ${isApplyToDropdownOpen ? 'active' : ''}`}
                      onClick={() => setIsApplyToDropdownOpen(!isApplyToDropdownOpen)}
                    >
                      <div className="selected-option">
                        <i className={`fas ${applyToOptions.find(opt => opt.value === newCampaign.applyTo)?.icon || 'fa-globe'}`}></i>
                        <span>{getSelectedApplyToLabel()}</span>
                      </div>
                      <i className={`fas fa-chevron-${isApplyToDropdownOpen ? 'up' : 'down'}`}></i>
                    </button>
                    
                    {isApplyToDropdownOpen && (
                      <div className="dropdown-menu">
                        {applyToOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={`dropdown-item ${newCampaign.applyTo === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelectApplyTo(option.value)}
                          >
                            <div className="option-icon">
                              <i className={`fas ${option.icon}`}></i>
                            </div>
                            <div className="option-content">
                              <span className="option-title">{option.label}</span>
                              <span className="option-description">{option.description}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Məhsul seçimi - yalnız məhsullar seçildikdə */}
                {newCampaign.applyTo === 'products' && (
                  <div className="form-group full-width selection-section">
                    <label>Məhsulları əlavə edin</label>
                    
                    {/* Məhsul əlavə etmə sahəsi */}
                    <div className="product-input-group">
                      <input 
                        type="text"
                        value={customProduct}
                        onChange={(e) => setCustomProduct(e.target.value)}
                        onKeyPress={handleProductKeyPress}
                        placeholder="Məhsul adını yazın və Enter basın"
                        className="product-input"
                      />
                      <button 
                        type="button"
                        onClick={handleAddProduct}
                        className="add-product-btn"
                        disabled={!customProduct.trim()}
                      >
                        <i className="fas fa-plus"></i>
                        Əlavə et
                      </button>
                    </div>

                    {/* Əlavə edilmiş məhsullar */}
                    {newCampaign.products.length > 0 && (
                      <div className="selected-products">
                        <div className="selected-products-title">
                          <i className="fas fa-cubes"></i>
                          <span>Seçilmiş məhsullar ({newCampaign.products.length})</span>
                        </div>
                        <div className="products-tags">
                          {newCampaign.products.map((product, index) => (
                            <div key={index} className="product-tag">
                              <span className="product-tag-name">{product}</span>
                              <button 
                                type="button"
                                className="remove-product-tag"
                                onClick={() => handleRemoveProduct(product)}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Promo kod toggle */}
                <div className="form-group full-width">
                  <label className="toggle-label">
                    <input 
                      type="checkbox"
                      checked={newCampaign.hasPromoCode}
                      onChange={(e) => setNewCampaign({...newCampaign, hasPromoCode: e.target.checked})}
                      className="toggle-checkbox"
                    />
                    <span className="toggle-switch"></span>
                    <span className="toggle-text">Promo kod istifadə et</span>
                  </label>
                </div>

                {newCampaign.hasPromoCode && (
                  <>
                    <div className="form-group">
                      <label>Promo kod</label>
                      <input 
                        type="text" 
                        value={newCampaign.promoCode}
                        onChange={(e) => setNewCampaign({...newCampaign, promoCode: e.target.value})}
                        placeholder="Məs: YAY20"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>İstifadə limiti</label>
                      <input 
                        type="number" 
                        value={newCampaign.usageLimit}
                        onChange={(e) => setNewCampaign({...newCampaign, usageLimit: e.target.value})}
                        placeholder="Məs: 100"
                        min="1"
                        className="form-input"
                      />
                    </div>
                  </>
                )}

                {/* Status dropdown */}
                <div className="form-group full-width">
                  <label>Status</label>
                  <div className="custom-dropdown" ref={statusDropdownRef}>
                    <button 
                      type="button"
                      className={`dropdown-header ${isStatusDropdownOpen ? 'active' : ''}`}
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    >
                      <div className="selected-option">
                        <i className={`fas ${statusOptions.find(opt => opt.value === newCampaign.status)?.icon || 'fa-circle'}`}></i>
                        <span>{getSelectedStatusLabel()}</span>
                      </div>
                      <i className={`fas fa-chevron-${isStatusDropdownOpen ? 'up' : 'down'}`}></i>
                    </button>
                    
                    {isStatusDropdownOpen && (
                      <div className="dropdown-menu">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={`dropdown-item ${newCampaign.status === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelectStatus(option.value)}
                          >
                            <div className="option-icon">
                              <i className={`fas ${option.icon}`}></i>
                            </div>
                            <div className="option-content">
                              <span className="option-title">{option.label}</span>
                              <span className="option-description">{option.description}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="campaign-modal-footer">
              <button 
                type="button"
                className="cancel-btn" 
                onClick={closeCreateModal}
              >
                Ləğv et
              </button>
              <button 
                type="button"
                className="save-btn"
                onClick={handleCreateCampaign}
                disabled={!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate || !newCampaign.discountValue}
              >
                <i className="fas fa-save"></i>
                {selectedCampaign ? 'Yadda saxla' : 'Kampaniya yarat'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Təsdiq modalları */}
      {showEndConfirmModal && (
        <div className="modal-overlay" onClick={closeEndModal}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon warning-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h3>Kampaniyanı bitir</h3>
            <p>Bu kampaniyanı dərhal bitirmək istədiyinizə əminsiniz?</p>
            <div className="confirm-modal-actions">
              <button 
                type="button"
                className="confirm-cancel-btn"
                onClick={closeEndModal}
              >
                İmtina
              </button>
              <button 
                type="button"
                className="confirm-ok-btn"
                onClick={handleEndNow}
              >
                Bəli, bitir
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon delete-icon">
              <i className="fas fa-trash-alt"></i>
            </div>
            <h3>Kampaniyanı sil</h3>
            <p>Bu kampaniyanı silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.</p>
            <div className="confirm-modal-actions">
              <button 
                type="button"
                className="confirm-cancel-btn"
                onClick={closeDeleteModal}
              >
                İmtina
              </button>
              <button 
                type="button"
                className="confirm-delete-btn"
                onClick={handleDeleteCampaign}
              >
                Bəli, sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;