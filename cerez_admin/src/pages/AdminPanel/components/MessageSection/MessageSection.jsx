// src/components/AdminPanel/components/MessageSection/MessageSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import './MessageSection.css';
import Pagination from '../Pagination'; // Pagination komponentini import edirik
import { 
  FiSearch, FiFilter, FiDownload, FiPrinter, 
  FiEye, FiTrash2, FiX, FiCheck, FiClock, 
  FiAlertCircle, FiMail, FiUser, FiPhone,
  FiCalendar, FiChevronDown, FiRefreshCw,
  FiMessageSquare
} from 'react-icons/fi';

const MessageSection = () => {
  // ========== STATE ==========
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState({ show: false, message: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, messageId: null });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  
  // Hər səhifədə göstəriləcək mesaj sayı - 10 olaraq qalır
  const messagesPerPage = 10;

  // ========== MOCK MESAJ MƏLUMATLARI ==========
  useEffect(() => {
    const demoMessages = [
      {
        id: 1,
        name: 'Əli Hüseynov',
        email: 'ali.huseynov@example.com',
        phone: '+994 50 123 45 67',
        subject: 'Məhsul haqqında sual',
        message: 'Salam. Badam məhsulunuz təzədir? Hansı ölkədən gətirilir? Qarışıq quru meyvə dəsti sifariş etmək istəyirəm. Çatdırılma neçə gün çəkir?',
        date: '2024-03-15',
        time: '14:30',
        status: 'unread'
      },
      {
        id: 2,
        name: 'Günel Məmmədova',
        email: 'gunel.m@example.com',
        phone: '+994 55 987 65 43',
        subject: 'Sifariş statusu',
        message: 'Salam. 2 gün əvvəl verdiyim sifarişin statusu nədir? Sifariş nömrəsi: QM-0245. Zəhmət olmasa məlumatlandırın.',
        date: '2024-03-14',
        time: '10:15',
        status: 'read'
      },
      {
        id: 3,
        name: 'Rəşad Əliyev',
        email: 'reshad@example.com',
        phone: '+994 70 456 78 90',
        subject: 'Kampaniya təklifi',
        message: 'Böyük miqdarda alış-veriş etmək istəyirəm. Topdan satış üçün xüsusi endirim imkanınız varmı? 50 kq badam və 30 kq fındıq almaq istəyirəm.',
        date: '2024-03-13',
        time: '09:45',
        status: 'unread'
      },
      {
        id: 4,
        name: 'Nigar Quliyeva',
        email: 'nigar.q@example.com',
        phone: '+994 51 234 56 78',
        subject: 'Çatdırılma ünvanı dəyişikliyi',
        message: 'Salam. Sifarişimi verdim amma çatdırılma ünvanını dəyişmək istəyirəm. Sifariş nömrəsi: QM-0251. Köhnə ünvan: Bakı, Nəsimi. Yeni ünvan: Bakı, Yasamal.',
        date: '2024-03-12',
        time: '16:20',
        status: 'read'
      },
      {
        id: 5,
        name: 'Tural Həsənov',
        email: 'tural.h@example.com',
        phone: '+994 77 345 67 89',
        subject: 'Məhsul geri qaytarılması',
        message: 'Salam. Aldığım qoz məhsulundan razı qalmadım. Keyfiyyət gözlədiyim kimi deyil. Məhsulu geri qaytarmaq istəyirəm. Proses necə olacaq?',
        date: '2024-03-11',
        time: '11:00',
        status: 'unread'
      },
      {
        id: 6,
        name: 'Aygün Kərimova',
        email: 'aygun.k@example.com',
        phone: '+994 50 876 54 32',
        subject: 'Yeni məhsul təklifi',
        message: 'Salam. Saytınızda "Şokoladlı qarışıq" adlı məhsul görmək istərdim. Belə bir məhsul əlavə etməyi düşünürsünüzmü?',
        date: '2024-03-10',
        time: '14:45',
        status: 'read'
      },
      {
        id: 7,
        name: 'Fərid Məmmədov',
        email: 'ferid.m@example.com',
        phone: '+994 55 432 10 98',
        subject: 'Ödəniş problemi',
        message: 'Salam. Sifarişimi ödəyərkən kartımda problem oldu. Alternativ ödəniş üsulu varmı? Nağd çatdırılma zamanı ödəyə bilərəmmi?',
        date: '2024-03-09',
        time: '09:30',
        status: 'unread'
      },
      {
        id: 8,
        name: 'Leyla Rüstəmova',
        email: 'leyla.r@example.com',
        phone: '+994 70 987 65 43',
        subject: 'Təşəkkür mesajı',
        message: 'Çox sağolun. Sifarişim çox tez çatdı. Məhsulların keyfiyyəti əla idi. Hər kəsə tövsiyə edirəm. Xüsusilə badam və fındıq çox təzə idi.',
        date: '2024-03-08',
        time: '18:15',
        status: 'read'
      },
      {
        id: 9,
        name: 'Cavid Tağıyev',
        email: 'cavid.t@example.com',
        phone: '+994 51 111 22 33',
        subject: 'Qida allergiyası',
        message: 'Salam. Fındıq və qoz allergiyam var. Sizin məhsullarınızda çarpaz kontaminasiya riski varmı? Təmiz şəkildə qablaşdırılan məhsullar varmı?',
        date: '2024-03-07',
        time: '13:20',
        status: 'unread'
      },
      {
        id: 10,
        name: 'Səbinə İsmayılova',
        email: 'sabine.i@example.com',
        phone: '+994 77 444 55 66',
        subject: 'Hədiyyə paketi',
        message: 'Salam. Dostum üçün hədiyyə paketi almaq istəyirəm. Hədiyyə qeydi yazmaq imkanı varmı? Paketə xüsusi qablaşdırma istəyirəm.',
        date: '2024-03-06',
        time: '15:40',
        status: 'read'
      },
      {
        id: 11,
        name: 'Orxan Qasımov',
        email: 'orxan.q@example.com',
        phone: '+994 50 999 88 77',
        subject: 'İşgüzar təklif',
        message: 'Salam. Bizim şirkət quru meyvələr və çərəzlər satışı ilə məşğuldur. Sizinlə əməkdaşlıq etmək istərdik. Əgər maraqlanırsınızsa, bizimlə əlaqə saxlayın.',
        date: '2024-03-05',
        time: '10:00',
        status: 'unread'
      },
      {
        id: 12,
        name: 'Zümrüd Əliyeva',
        email: 'zumrud.a@example.com',
        phone: '+994 55 666 77 88',
        subject: 'Çatdırılma vaxtı',
        message: 'Salam. Sifarişimi nə vaxt gözləyə bilərəm? Sifariş nömrəsi: QM-0263. Bakı, Xətai rayonuna çatdırılma neçə gün çəkir?',
        date: '2024-03-04',
        time: '12:30',
        status: 'read'
      }
    ];
    
    setTimeout(() => {
      setMessages(demoMessages);
      setLoading(false);
    }, 500);
  }, []);

  // ========== CLICK OUTSIDE HANDLER ==========
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

  // ========== FILTER MESSAGES ==========
  const getFilteredMessages = () => {
    let filtered = [...messages];
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.phone.includes(searchTerm)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(msg => msg.status === filterStatus);
    }
    
    return filtered;
  };

  const filteredMessages = getFilteredMessages();
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

  // ========== HANDLERS ==========
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleViewMessage = (message) => {
    if (message.status === 'unread') {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'read' } : msg
      ));
    }
    setViewModal({ show: true, message });
  };

  const closeViewModal = () => {
    setViewModal({ show: false, message: null });
  };

  const handleDeleteClick = (messageId) => {
    setDeleteModal({ show: true, messageId });
  };

  const confirmDelete = () => {
    setMessages(prev => prev.filter(msg => msg.id !== deleteModal.messageId));
    
    if (currentMessages.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    
    setDeleteModal({ show: false, messageId: null });
    showNotification('Mesaj uğurla silindi!', 'success');
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, messageId: null });
  };

  const handleMarkAsRead = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    ));
    showNotification('Mesaj oxundu olaraq işarələndi!', 'info');
  };

  const handleMarkAllAsRead = () => {
    setMessages(prev => prev.map(msg => 
      msg.status === 'unread' ? { ...msg, status: 'read' } : msg
    ));
    showNotification('Bütün mesajlar oxundu olaraq işarələndi!', 'info');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showNotification('Məlumatlar yeniləndi!', 'info');
    }, 500);
    setCurrentPage(1);
    setSearchTerm('');
    setFilterStatus('all');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setCurrentPage(1);
    showNotification('Filtrlər təmizləndi!', 'info');
  };

  const handleExport = () => {
    const exportData = filteredMessages.map(msg => ({
      'ID': msg.id,
      'Ad Soyad': msg.name,
      'Email': msg.email,
      'Telefon': msg.phone,
      'Mövzu': msg.subject,
      'Mesaj': msg.message,
      'Tarix': msg.date,
      'Saat': msg.time,
      'Status': msg.status === 'read' ? 'Oxundu' : 'Oxunmadı'
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
    link.setAttribute('download', `mesajlar_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification(`${exportData.length} mesaj export edildi!`, 'success');
  };

  // ========== SƏHİFƏ DƏYİŞMƏ - SADƏCƏ STATE YENİLƏYİR ==========
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // URL artıq Pagination komponentində yenilənir (əgər URL parametrləri istifadə edilirsə)
    // Burada SADƏCƏ state-i dəyişdiririk
  };

  const getStatusBadge = (status) => {
    if (status === 'read') {
      return <span className="msg-status-badge msg-status-read"><FiCheck /> Oxundu</span>;
    }
    return <span className="msg-status-badge msg-status-unread"><FiClock /> Oxunmadı</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Dünən';
    } else {
      return date.toLocaleDateString('az-AZ');
    }
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  if (loading) {
    return (
      <div className="msg-container">
        <div className="msg-loading">
          <div className="msg-spinner"></div>
          <p>Mesajlar yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="msg-container">
      {/* Bildiriş */}
      {notification.show && (
        <div className={`msg-notification msg-notification-${notification.type}`}>
          <div className="msg-notification-content">
            {notification.type === 'success' && <FiCheck />}
            {notification.type === 'info' && <FiClock />}
            {notification.type === 'error' && <FiAlertCircle />}
            <span>{notification.message}</span>
          </div>
          <button className="msg-notification-close" onClick={() => setNotification({ show: false, message: '', type: 'success' })}>
            <FiX />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="msg-header">
        <div>
          <h1 className="msg-title">Mesajlar</h1>
          <p className="msg-subtitle">Müştərilərdən gələn mesajların idarə edilməsi</p>
        </div>
        <div className="msg-header-actions">
          <button className="msg-action-btn msg-refresh-btn" onClick={handleRefresh}>
            <FiRefreshCw /> Yenilə
          </button>
          <button className="msg-action-btn msg-export-btn" onClick={handleExport}>
            <FiDownload /> Export
          </button>
          <button className="msg-action-btn msg-print-btn" onClick={() => window.print()}>
            <FiPrinter /> Çap et
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="msg-stats">
        <div className="msg-stat-card">
          <div className="stat-icon stat-total">
            <FiMail />
          </div>
          <div className="stat-info">
            <h3>{messages.length}</h3>
            <p>Ümumi mesaj</p>
          </div>
        </div>
        <div className="msg-stat-card">
          <div className="stat-icon stat-unread">
            <FiClock />
          </div>
          <div className="stat-info">
            <h3>{unreadCount}</h3>
            <p>Oxunmamış</p>
          </div>
        </div>
        <div className="msg-stat-card">
          <div className="stat-icon stat-today">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <h3>{messages.filter(m => formatDate(m.date) === 'Bugün').length}</h3>
            <p>Bu gün gələn</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="msg-filters" ref={dropdownRef}>
        <div className="msg-search-wrapper">
          <FiSearch className="msg-search-icon" />
          <input
            type="text"
            placeholder="Axtarış (ad, email, telefon, mesaj)..."
            value={searchTerm}
            onChange={handleSearch}
            className="msg-search-input"
          />
          {searchTerm && (
            <FiX className="msg-clear-search" onClick={() => setSearchTerm('')} />
          )}
        </div>

        <div className="msg-filter-buttons">
          <div className="msg-filter-dropdown">
            <button 
              className={`msg-filter-btn ${filterStatus !== 'all' ? 'active' : ''}`}
              onClick={() => toggleDropdown('status')}
            >
              <FiFilter />
              <span>
                {filterStatus === 'all' ? 'Bütün mesajlar' : 
                 filterStatus === 'read' ? 'Oxunanlar' : 'Oxunmayanlar'}
              </span>
              <FiChevronDown className={`msg-dropdown-arrow ${openDropdown === 'status' ? 'open' : ''}`} />
            </button>
            {openDropdown === 'status' && (
              <div className="msg-dropdown-menu">
                <div 
                  className={`msg-dropdown-item ${filterStatus === 'all' ? 'selected' : ''}`}
                  onClick={() => { setFilterStatus('all'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Bütün mesajlar
                </div>
                <div 
                  className={`msg-dropdown-item ${filterStatus === 'read' ? 'selected' : ''}`}
                  onClick={() => { setFilterStatus('read'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Oxunanlar
                </div>
                <div 
                  className={`msg-dropdown-item ${filterStatus === 'unread' ? 'selected' : ''}`}
                  onClick={() => { setFilterStatus('unread'); setOpenDropdown(null); setCurrentPage(1); }}
                >
                  Oxunmayanlar
                </div>
              </div>
            )}
          </div>

          {unreadCount > 0 && (
            <button className="msg-action-btn msg-mark-read-all" onClick={handleMarkAllAsRead}>
              <FiCheck /> Hamısını oxundu işarələ
            </button>
          )}

          {(searchTerm || filterStatus !== 'all') && (
            <button className="msg-filter-btn msg-clear-all" onClick={clearFilters}>
              <FiX /> Təmizlə
            </button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="msg-results-info">
        <p>Cəmi <strong>{filteredMessages.length}</strong> mesaj tapıldı</p>
        {filteredMessages.length > 0 && (
          <p className="msg-results-detail">Səhifə: {currentPage} / {totalPages}</p>
        )}
      </div>

      {/* Messages Table */}
      <div className="msg-table-wrapper">
        {filteredMessages.length === 0 ? (
          <div className="msg-no-data">
            <FiMessageSquare size={48} />
            <p>Heç bir mesaj tapılmadı</p>
            <button className="msg-clear-filters-btn" onClick={clearFilters}>
              Filtrləri təmizlə
            </button>
          </div>
        ) : (
          <table className="msg-table">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Göndərən</th>
                <th style={{ width: '200px' }}>Email</th>
                <th style={{ width: '350px' }}>Mesaj</th>
                <th style={{ width: '100px' }}>Tarix</th>
                <th style={{ width: '80px' }}>Saat</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '140px' }}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {currentMessages.map((message) => (
                <tr key={message.id} className={message.status === 'unread' ? 'msg-unread-row' : ''}>
                  <td className="msg-name-cell">
                    <span className="msg-sender-name">{message.name}</span>
                  </td>
                  <td className="msg-email-cell">{message.email}</td>
                  <td className="msg-preview-cell">
                    <span className="msg-preview-text" title={message.message}>
                      {message.message.length > 100 ? `${message.message.substring(0, 100)}...` : message.message}
                    </span>
                  </td>
                  <td className="msg-date-cell">{formatDate(message.date)}</td>
                  <td className="msg-time-cell">{message.time}</td>
                  <td className="msg-status-cell">{getStatusBadge(message.status)}</td>
                  <td className="msg-actions-cell">
                    <div className="msg-action-buttons">
                      <button 
                        className="msg-action-icon msg-view-btn" 
                        onClick={() => handleViewMessage(message)}
                        title="Mesaja bax"
                      >
                        <FiEye />
                      </button>
                      {message.status === 'unread' && (
                        <button 
                          className="msg-action-icon msg-mark-read-btn" 
                          onClick={() => handleMarkAsRead(message.id)}
                          title="Oxundu işarələ"
                        >
                          <FiCheck />
                        </button>
                      )}
                      <button 
                        className="msg-action-icon msg-delete-btn" 
                        onClick={() => handleDeleteClick(message.id)}
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

      {/* View Modal */}
      {viewModal.show && (
        <div className="msg-modal-overlay" onClick={closeViewModal}>
          <div className="msg-modal msg-view-modal" onClick={e => e.stopPropagation()}>
            <div className="msg-modal-header">
              <h2>Mesaj Detalları</h2>
              <button className="msg-modal-close" onClick={closeViewModal}>
                <FiX />
              </button>
            </div>
            <div className="msg-modal-body">
              <div className="msg-detail-header">
                <div className="msg-detail-info">
                  <h3>{viewModal.message?.name}</h3>
                  <p>{viewModal.message?.email}</p>
                  <p className="msg-detail-phone">{viewModal.message?.phone}</p>
                </div>
                <div className="msg-detail-meta">
                  <span className="msg-detail-date">{viewModal.message?.date} {viewModal.message?.time}</span>
                  {getStatusBadge(viewModal.message?.status)}
                </div>
              </div>
              <div className="msg-detail-message">
                <label>Mesaj:</label>
                <div className="msg-detail-content">
                  {viewModal.message?.message}
                </div>
              </div>
            </div>
            <div className="msg-modal-footer">
              <button className="msg-modal-btn secondary" onClick={closeViewModal}>
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="msg-modal-overlay" onClick={closeDeleteModal}>
          <div className="msg-modal msg-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="msg-modal-header">
              <h2>Mesajı Sil</h2>
              <button className="msg-modal-close" onClick={closeDeleteModal}>
                <FiX />
              </button>
            </div>
            <div className="msg-modal-body">
              <FiAlertCircle size={48} className="delete-icon" />
              <p className="delete-warning">
                Bu mesajı silmək istədiyinizə əminsiniz?
              </p>
              <p className="delete-note">
                Bu əməliyyat geri qaytarıla bilməz.
              </p>
            </div>
            <div className="msg-modal-footer">
              <button className="msg-modal-btn secondary" onClick={closeDeleteModal}>
                Ləğv et
              </button>
              <button className="msg-modal-btn danger" onClick={confirmDelete}>
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSection;