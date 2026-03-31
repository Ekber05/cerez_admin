// src/components/AdminPanel/components/Users.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Users.css';
import Pagination from './Pagination';
import { 
  FiSearch, FiUser, FiMail, FiPhone, FiCalendar, 
  FiMoreVertical, FiEye, FiEdit, FiTrash2, FiX,
  FiCheck, FiClock, FiAlertCircle, FiUserCheck,
  FiUserX, FiFilter, FiDownload, FiRefreshCw,
  FiChevronLeft
} from 'react-icons/fi';

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState({ show: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null });
  const [editModal, setEditModal] = useState({ show: false, user: null });
  const [statusModal, setStatusModal] = useState({ show: false, user: null });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  
  const usersPerPage = 20;

  // URL-dən filter və search parametrlərini oxu
  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl && ['active', 'inactive', 'blocked'].includes(statusFromUrl)) {
      setFilterStatus(statusFromUrl);
    }
    
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, []);

  // Demo istifadəçi məlumatları (35 istifadəçi)
  useEffect(() => {
    const demoUsers = [
      { id: 1, name: 'Əli Hüseynov', email: 'ali.huseynov@example.com', phone: '+994 50 123 45 67', registerDate: '2024-01-15', status: 'active', orders: 12, totalSpent: 345.50, avatar: null },
      { id: 2, name: 'Günel Məmmədova', email: 'gunel.m@example.com', phone: '+994 55 987 65 43', registerDate: '2024-02-20', status: 'active', orders: 8, totalSpent: 234.80, avatar: null },
      { id: 3, name: 'Rəşad Əliyev', email: 'reshad@example.com', phone: '+994 70 456 78 90', registerDate: '2024-03-10', status: 'inactive', orders: 3, totalSpent: 89.99, avatar: null },
      { id: 4, name: 'Nigar Quliyeva', email: 'nigar.q@example.com', phone: '+994 51 234 56 78', registerDate: '2024-01-05', status: 'active', orders: 25, totalSpent: 678.40, avatar: null },
      { id: 5, name: 'Tural Həsənov', email: 'tural.h@example.com', phone: '+994 77 345 67 89', registerDate: '2024-02-28', status: 'blocked', orders: 0, totalSpent: 0, avatar: null },
      { id: 6, name: 'Aygün Kərimova', email: 'aygun.k@example.com', phone: '+994 50 876 54 32', registerDate: '2024-03-25', status: 'active', orders: 5, totalSpent: 156.30, avatar: null },
      { id: 7, name: 'Fərid Məmmədov', email: 'ferid.m@example.com', phone: '+994 55 432 10 98', registerDate: '2024-04-01', status: 'inactive', orders: 1, totalSpent: 45.00, avatar: null },
      { id: 8, name: 'Leyla Rüstəmova', email: 'leyla.r@example.com', phone: '+994 70 987 65 43', registerDate: '2024-01-20', status: 'active', orders: 18, totalSpent: 523.75, avatar: null },
      { id: 9, name: 'Cavid Tağıyev', email: 'cavid.t@example.com', phone: '+994 51 111 22 33', registerDate: '2024-02-15', status: 'blocked', orders: 0, totalSpent: 0, avatar: null },
      { id: 10, name: 'Səbinə İsmayılova', email: 'sabine.i@example.com', phone: '+994 77 444 55 66', registerDate: '2024-03-05', status: 'active', orders: 7, totalSpent: 234.50, avatar: null },
      { id: 11, name: 'Orxan Qasımov', email: 'orxan.q@example.com', phone: '+994 50 999 88 77', registerDate: '2024-04-10', status: 'active', orders: 2, totalSpent: 67.80, avatar: null },
      { id: 12, name: 'Zümrüd Əliyeva', email: 'zumrud.a@example.com', phone: '+994 55 666 77 88', registerDate: '2024-01-28', status: 'inactive', orders: 4, totalSpent: 123.40, avatar: null },
      { id: 13, name: 'Kamran Əhmədov', email: 'kamran.a@example.com', phone: '+994 50 111 22 33', registerDate: '2024-05-15', status: 'active', orders: 15, totalSpent: 567.90, avatar: null },
      { id: 14, name: 'Sevinc Rəhimova', email: 'sevinc.r@example.com', phone: '+994 55 222 33 44', registerDate: '2024-05-18', status: 'active', orders: 9, totalSpent: 289.50, avatar: null },
      { id: 15, name: 'Rüfət İbrahimov', email: 'rufet.i@example.com', phone: '+994 70 333 44 55', registerDate: '2024-05-20', status: 'inactive', orders: 2, totalSpent: 78.30, avatar: null },
      { id: 16, name: 'Nərmin Səmədova', email: 'nermin.s@example.com', phone: '+994 77 444 55 66', registerDate: '2024-05-22', status: 'active', orders: 22, totalSpent: 890.25, avatar: null },
      { id: 17, name: 'Elvin Tağızadə', email: 'elvin.t@example.com', phone: '+994 50 555 66 77', registerDate: '2024-05-25', status: 'blocked', orders: 0, totalSpent: 0, avatar: null },
      { id: 18, name: 'Ləman Hüseynova', email: 'leman.h@example.com', phone: '+994 55 666 77 88', registerDate: '2024-05-28', status: 'active', orders: 11, totalSpent: 345.60, avatar: null },
      { id: 19, name: 'Nurlan Qəmbərov', email: 'nurlan.q@example.com', phone: '+994 70 777 88 99', registerDate: '2024-06-01', status: 'active', orders: 6, totalSpent: 178.40, avatar: null },
      { id: 20, name: 'Aynur Məmmədli', email: 'aynur.m@example.com', phone: '+994 77 888 99 00', registerDate: '2024-06-03', status: 'inactive', orders: 3, totalSpent: 95.70, avatar: null },
      { id: 21, name: 'Cəlal Əsgərov', email: 'celal.a@example.com', phone: '+994 50 999 00 11', registerDate: '2024-06-05', status: 'active', orders: 28, totalSpent: 1234.50, avatar: null },
      { id: 22, name: 'Zəhra Quliyeva', email: 'zehra.q@example.com', phone: '+994 55 111 22 33', registerDate: '2024-06-08', status: 'active', orders: 14, totalSpent: 567.80, avatar: null },
      { id: 23, name: 'Ramin Süleymanov', email: 'ramin.s@example.com', phone: '+994 70 222 33 44', registerDate: '2024-06-10', status: 'blocked', orders: 1, totalSpent: 23.50, avatar: null },
      { id: 24, name: 'Gülər Əliyeva', email: 'guler.a@example.com', phone: '+994 77 333 44 55', registerDate: '2024-06-12', status: 'active', orders: 19, totalSpent: 678.90, avatar: null },
      { id: 25, name: 'Emin Rzayev', email: 'emin.r@example.com', phone: '+994 50 444 55 66', registerDate: '2024-06-15', status: 'active', orders: 8, totalSpent: 234.40, avatar: null },
      { id: 26, name: 'Səidə Qasımova', email: 'seide.q@example.com', phone: '+994 55 555 66 77', registerDate: '2024-06-18', status: 'inactive', orders: 2, totalSpent: 67.20, avatar: null },
      { id: 27, name: 'İlham Nəsirov', email: 'ilham.n@example.com', phone: '+994 70 666 77 88', registerDate: '2024-06-20', status: 'active', orders: 16, totalSpent: 789.30, avatar: null },
      { id: 28, name: 'Fidan Vəliyeva', email: 'fidan.v@example.com', phone: '+994 77 777 88 99', registerDate: '2024-06-22', status: 'active', orders: 10, totalSpent: 345.80, avatar: null },
      { id: 29, name: 'Murad Həsənli', email: 'murad.h@example.com', phone: '+994 50 888 99 00', registerDate: '2024-06-25', status: 'blocked', orders: 0, totalSpent: 0, avatar: null },
      { id: 30, name: 'Aytən Məmmədova', email: 'ayten.m@example.com', phone: '+994 55 999 00 11', registerDate: '2024-06-28', status: 'active', orders: 21, totalSpent: 987.60, avatar: null },
      { id: 31, name: 'Sərxan Bağırov', email: 'serxan.b@example.com', phone: '+994 70 111 22 33', registerDate: '2024-07-01', status: 'active', orders: 5, totalSpent: 123.40, avatar: null },
      { id: 32, name: 'Nazlı Cəfərova', email: 'nazli.c@example.com', phone: '+994 77 222 33 44', registerDate: '2024-07-03', status: 'inactive', orders: 4, totalSpent: 156.70, avatar: null },
      { id: 33, name: 'Taleh Məmmədov', email: 'taleh.m@example.com', phone: '+994 50 333 44 55', registerDate: '2024-07-05', status: 'active', orders: 13, totalSpent: 456.80, avatar: null },
      { id: 34, name: 'Səbinə Tağıyeva', email: 'sabine.t@example.com', phone: '+994 55 444 55 66', registerDate: '2024-07-08', status: 'active', orders: 7, totalSpent: 234.50, avatar: null },
      { id: 35, name: 'Fəridə Qurbanova', email: 'feride.q@example.com', phone: '+994 70 555 66 77', registerDate: '2024-07-10', status: 'active', orders: 30, totalSpent: 1456.90, avatar: null }
    ];
    
    setTimeout(() => {
      setUsers(demoUsers);
      setLoading(false);
    }, 500);
  }, []);

  // Click outside handler
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

  // Filter users
  const getFilteredUsers = () => {
    let filtered = [...users];
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }
    
    return filtered;
  };

  const filteredUsers = getFilteredUsers();
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    
    // URL-i yenilə (page-i sil)
    const newParams = new URLSearchParams();
    if (filterStatus !== 'all') newParams.set('status', filterStatus);
    if (value.trim() !== '') newParams.set('search', value);
    setSearchParams(newParams, { replace: true });
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    setOpenDropdown(null);
    
    // URL-i yenilə (page-i sil)
    const newParams = new URLSearchParams();
    if (status !== 'all') newParams.set('status', status);
    if (searchTerm.trim() !== '') newParams.set('search', searchTerm);
    setSearchParams(newParams, { replace: true });
  };

  // Səhifə dəyişmə funksiyası - SADƏCƏ STATE YENİLƏYİR
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewUser = (user) => {
    setViewModal({ show: true, user });
  };

  const handleEditUser = (user) => {
    setEditModal({ show: true, user: { ...user } });
  };

  const handleEditChange = (field, value) => {
    setEditModal({
      ...editModal,
      user: {
        ...editModal.user,
        [field]: value
      }
    });
  };

  const saveEdit = () => {
    setUsers(prev => prev.map(user => 
      user.id === editModal.user.id ? editModal.user : user
    ));
    setEditModal({ show: false, user: null });
    showNotification('İstifadəçi məlumatları uğurla yeniləndi!', 'success');
  };

  const handleDeleteClick = (userId) => {
    setDeleteModal({ show: true, userId });
  };

  const confirmDelete = () => {
    setUsers(prev => prev.filter(user => user.id !== deleteModal.userId));
    if (currentUsers.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setDeleteModal({ show: false, userId: null });
    showNotification('İstifadəçi uğurla silindi!', 'success');
  };

  const handleStatusModalOpen = (user) => {
    setStatusModal({ show: true, user: { ...user } });
  };

  const handleStatusSelect = (newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === statusModal.user.id ? { ...user, status: newStatus } : user
    ));
    setStatusModal({ show: false, user: null });
    showNotification(`İstifadəçi statusu "${newStatus === 'active' ? 'Aktiv' : newStatus === 'inactive' ? 'Deaktiv' : 'Bloklanmış'}" olaraq dəyişdirildi!`, 'success');
  };

  const closeStatusModal = () => {
    setStatusModal({ show: false, user: null });
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
    setSearchParams({}, { replace: true });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
    showNotification('Filtrlər təmizləndi!', 'info');
  };

  const handleExport = () => {
    const exportData = filteredUsers.map(user => ({
      'ID': user.id,
      'Ad Soyad': user.name,
      'Email': user.email,
      'Telefon': user.phone,
      'Qeydiyyat tarixi': user.registerDate,
      'Status': user.status === 'active' ? 'Aktiv' : user.status === 'inactive' ? 'Deaktiv' : 'Bloklanmış',
      'Sifariş sayı': user.orders,
      'Ümumi xərc': `${user.totalSpent} AZN`
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
    link.setAttribute('download', `istifadeciler_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification(`${exportData.length} istifadəçi export edildi!`, 'success');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="users-status-badge users-status-active">Aktiv</span>;
      case 'inactive':
        return <span className="users-status-badge users-status-inactive">Deaktiv</span>;
      case 'blocked':
        return <span className="users-status-badge users-status-blocked">Bloklanmış</span>;
      default:
        return <span className="users-status-badge">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ');
  };

  if (loading) {
    return (
      <div className="users-container">
        <div className="users-loading">
          <div className="users-spinner"></div>
          <p>İstifadəçilər yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      {/* Bildiriş */}
      {notification.show && (
        <div className={`users-notification users-notification-${notification.type}`}>
          <div className="users-notification-content">
            {notification.type === 'success' && <FiCheck />}
            {notification.type === 'info' && <FiClock />}
            {notification.type === 'error' && <FiAlertCircle />}
            <span>{notification.message}</span>
          </div>
          <button className="users-notification-close" onClick={() => setNotification({ show: false, message: '', type: 'success' })}>
            <FiX />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="users-header">
        <div>
          <h1 className="users-title">İstifadəçilər</h1>
          <p className="users-subtitle">Sistemdə qeydiyyatdan keçən istifadəçilərin idarə edilməsi</p>
        </div>
        <div className="users-header-actions">
          <button className="users-action-btn users-refresh-btn" onClick={handleRefresh}>
            <FiRefreshCw /> Yenilə
          </button>
          <button className="users-action-btn users-export-btn" onClick={handleExport}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="users-stats">
        <div className="users-stat-card">
          <div className="stat-icon stat-total">
            <FiUser />
          </div>
          <div className="stat-info">
            <h3>{users.length}</h3>
            <p>Ümumi istifadəçi</p>
          </div>
        </div>
        <div className="users-stat-card">
          <div className="stat-icon stat-active">
            <FiUserCheck />
          </div>
          <div className="stat-info">
            <h3>{users.filter(u => u.status === 'active').length}</h3>
            <p>Aktiv istifadəçi</p>
          </div>
        </div>
        <div className="users-stat-card">
          <div className="stat-icon stat-inactive">
            <FiClock />
          </div>
          <div className="stat-info">
            <h3>{users.filter(u => u.status === 'inactive').length}</h3>
            <p>Deaktiv istifadəçi</p>
          </div>
        </div>
        <div className="users-stat-card">
          <div className="stat-icon stat-blocked">
            <FiUserX />
          </div>
          <div className="stat-info">
            <h3>{users.filter(u => u.status === 'blocked').length}</h3>
            <p>Bloklanmış istifadəçi</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="users-filters" ref={dropdownRef}>
        <div className="users-search-wrapper">
          <FiSearch className="users-search-icon" />
          <input
            type="text"
            placeholder="Axtarış (ad, email, telefon)..."
            value={searchTerm}
            onChange={handleSearch}
            className="users-search-input"
          />
          {searchTerm && (
            <FiX className="users-clear-search" onClick={() => {
              setSearchTerm('');
              setCurrentPage(1);
              const newParams = new URLSearchParams();
              if (filterStatus !== 'all') newParams.set('status', filterStatus);
              setSearchParams(newParams, { replace: true });
            }} />
          )}
        </div>

        <div className="users-filter-buttons">
          <div className="users-filter-dropdown">
            <button 
              className={`users-filter-btn ${filterStatus !== 'all' ? 'active' : ''}`}
              onClick={() => toggleDropdown('status')}
            >
              <FiFilter />
              <span>
                {filterStatus === 'all' ? 'Bütün statuslar' : 
                 filterStatus === 'active' ? 'Aktiv' :
                 filterStatus === 'inactive' ? 'Deaktiv' : 'Bloklanmış'}
              </span>
              <FiChevronLeft className={`users-dropdown-arrow ${openDropdown === 'status' ? 'open' : ''}`} />
            </button>
            {openDropdown === 'status' && (
              <div className="users-dropdown-menu">
                <div 
                  className={`users-dropdown-item ${filterStatus === 'all' ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  Bütün statuslar
                </div>
                <div 
                  className={`users-dropdown-item ${filterStatus === 'active' ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('active')}
                >
                  Aktiv
                </div>
                <div 
                  className={`users-dropdown-item ${filterStatus === 'inactive' ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('inactive')}
                >
                  Deaktiv
                </div>
                <div 
                  className={`users-dropdown-item ${filterStatus === 'blocked' ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('blocked')}
                >
                  Bloklanmış
                </div>
              </div>
            )}
          </div>

          {(searchTerm || filterStatus !== 'all') && (
            <button className="users-filter-btn users-clear-all" onClick={clearFilters}>
              <FiX /> Təmizlə
            </button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="users-results-info">
        <p>Cəmi <strong>{filteredUsers.length}</strong> istifadəçi tapıldı</p>
        {filteredUsers.length > 0 && (
          <p className="users-results-detail">Səhifə: {currentPage} / {totalPages}</p>
        )}
      </div>

      {/* Users Table */}
      <div className="users-table-wrapper">
        {filteredUsers.length === 0 ? (
          <div className="users-no-data">
            <FiUser size={48} />
            <p>Heç bir istifadəçi tapılmadı</p>
            <button className="users-clear-filters-btn" onClick={clearFilters}>
              Filtrləri təmizlə
            </button>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ad Soyad</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Qeydiyyat tarixi</th>
                <th>Status</th>
                <th>Sifariş sayı</th>
                <th>Ümumi xərc</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className="users-index">{(currentPage - 1) * usersPerPage + index + 1}</td>
                  <td className="users-name-cell">
                    <div className="users-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="user-name-text" title={user.name}>{user.name}</span>
                  </td>
                  <td className="users-email-cell">
                    <span className="user-email-text" title={user.email}>{user.email}</span>
                  </td>
                  <td className="users-phone-cell">
                    <span className="user-phone-text">{user.phone}</span>
                  </td>
                  <td className="users-date-cell">{formatDate(user.registerDate)}</td>
                  <td className="users-status-cell">{getStatusBadge(user.status)}</td>
                  <td className="users-orders-count">{user.orders}</td>
                  <td className="users-spent">₼{user.totalSpent.toFixed(2)}</td>
                  <td className="users-actions-cell">
                    <div className="users-action-buttons">
                      <button 
                        className="users-action-btn users-view-btn" 
                        onClick={() => handleViewUser(user)}
                        title="Bax"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="users-action-btn users-edit-btn" 
                        onClick={() => handleEditUser(user)}
                        title="Redaktə et"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="users-action-btn users-status-btn" 
                        onClick={() => handleStatusModalOpen(user)}
                        title="Status dəyiş"
                      >
                        <FiFilter />
                      </button>
                      <button 
                        className="users-action-btn users-delete-btn" 
                        onClick={() => handleDeleteClick(user.id)}
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
        <div className="users-modal-overlay" onClick={() => setViewModal({ show: false, user: null })}>
          <div className="users-modal users-view-modal" onClick={e => e.stopPropagation()}>
            <div className="users-modal-header">
              <h2>İstifadəçi Məlumatları</h2>
              <button className="users-modal-close" onClick={() => setViewModal({ show: false, user: null })}>
                <FiX />
              </button>
            </div>
            <div className="users-modal-body">
              <div className="users-view-avatar">
                {viewModal.user?.avatar ? (
                  <img src={viewModal.user.avatar} alt={viewModal.user.name} />
                ) : (
                  <div className="avatar-large">
                    {viewModal.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="users-view-info">
                <div className="info-row">
                  <label>Ad Soyad:</label>
                  <span>{viewModal.user?.name}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{viewModal.user?.email}</span>
                </div>
                <div className="info-row">
                  <label>Telefon:</label>
                  <span>{viewModal.user?.phone}</span>
                </div>
                <div className="info-row">
                  <label>Qeydiyyat tarixi:</label>
                  <span>{formatDate(viewModal.user?.registerDate)}</span>
                </div>
                <div className="info-row">
                  <label>Status:</label>
                  <span>{getStatusBadge(viewModal.user?.status)}</span>
                </div>
                <div className="info-row">
                  <label>Sifariş sayı:</label>
                  <span>{viewModal.user?.orders}</span>
                </div>
                <div className="info-row">
                  <label>Ümumi xərc:</label>
                  <span className="spent-amount">₼{viewModal.user?.totalSpent.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="users-modal-footer">
              <button className="users-modal-btn primary" onClick={() => setViewModal({ show: false, user: null })}>
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.show && (
        <div className="users-modal-overlay" onClick={() => setEditModal({ show: false, user: null })}>
          <div className="users-modal users-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="users-modal-header">
              <h2>İstifadəçini Redaktə Et</h2>
              <button className="users-modal-close" onClick={() => setEditModal({ show: false, user: null })}>
                <FiX />
              </button>
            </div>
            <div className="users-modal-body">
              <div className="users-form-group">
                <label>Ad Soyad</label>
                <input
                  type="text"
                  value={editModal.user?.name || ''}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="users-modal-input"
                  placeholder="Ad Soyad"
                />
              </div>
              <div className="users-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editModal.user?.email || ''}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                  className="users-modal-input"
                  placeholder="Email"
                />
              </div>
              <div className="users-form-group">
                <label>Telefon</label>
                <input
                  type="tel"
                  value={editModal.user?.phone || ''}
                  onChange={(e) => handleEditChange('phone', e.target.value)}
                  className="users-modal-input"
                  placeholder="Telefon"
                />
              </div>
            </div>
            <div className="users-modal-footer">
              <button className="users-modal-btn secondary" onClick={() => setEditModal({ show: false, user: null })}>
                Ləğv et
              </button>
              <button className="users-modal-btn primary" onClick={saveEdit}>
                <FiCheck /> Yadda saxla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {statusModal.show && (
        <div className="users-modal-overlay" onClick={closeStatusModal}>
          <div className="users-modal users-status-modal" onClick={e => e.stopPropagation()}>
            <div className="users-modal-header">
              <h2>Status Dəyiş</h2>
              <button className="users-modal-close" onClick={closeStatusModal}>
                <FiX />
              </button>
            </div>
            <div className="users-modal-body">
              <p className="users-status-info">
                İstifadəçi: <strong>{statusModal.user?.name}</strong>
              </p>
              <p className="users-status-info">
                Cari status: {getStatusBadge(statusModal.user?.status)}
              </p>
              <div className="users-status-options">
                <button 
                  className={`users-status-option ${statusModal.user?.status === 'active' ? 'active' : ''}`}
                  onClick={() => handleStatusSelect('active')}
                >
                  <FiCheck /> Aktiv
                </button>
                <button 
                  className={`users-status-option ${statusModal.user?.status === 'inactive' ? 'active' : ''}`}
                  onClick={() => handleStatusSelect('inactive')}
                >
                  <FiClock /> Deaktiv
                </button>
                <button 
                  className={`users-status-option ${statusModal.user?.status === 'blocked' ? 'active' : ''}`}
                  onClick={() => handleStatusSelect('blocked')}
                >
                  <FiUserX /> Blokla
                </button>
              </div>
            </div>
            <div className="users-modal-footer">
              <button className="users-modal-btn secondary" onClick={closeStatusModal}>Bağla</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="users-modal-overlay" onClick={() => setDeleteModal({ show: false, userId: null })}>
          <div className="users-modal users-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="users-modal-header">
              <h2>İstifadəçini Sil</h2>
              <button className="users-modal-close" onClick={() => setDeleteModal({ show: false, userId: null })}>
                <FiX />
              </button>
            </div>
            <div className="users-modal-body">
              <FiAlertCircle size={48} className="delete-icon" />
              <p className="delete-warning">
                Bu istifadəçini silmək istədiyinizə əminsiniz?
              </p>
              <p className="delete-note">
                Bu əməliyyat geri qaytarıla bilməz.
              </p>
            </div>
            <div className="users-modal-footer">
              <button className="users-modal-btn secondary" onClick={() => setDeleteModal({ show: false, userId: null })}>
                Ləğv et
              </button>
              <button className="users-modal-btn danger" onClick={confirmDelete}>
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;