import React from 'react';
import './NotificationDetails.css';

const NotificationDetails = ({ notification, onDelete }) => {
  // Bildiriş seçilməyibsə
  if (!notification) {
    return (
      <div className="no-selection">
        <div className="no-selection-icon">📬</div>
        <h3>Bildiriş seçilməyib</h3>
        <p>Ətraflı məlumat üçün bildiriş seçin</p>
      </div>
    );
  }

  const { type, details, title, time, priority, message, user } = notification;

  // Prioritetə görə badge
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <span className="priority-badge-large priority-high">Yüksək Prioritet</span>;
      case 'medium': return <span className="priority-badge-large priority-medium">Orta Prioritet</span>;
      case 'low': return <span className="priority-badge-large priority-low">Aşağı Prioritet</span>;
      default: return null;
    }
  };

  // Tipə görə ikon
  const getTypeIcon = (type) => {
    switch(type) {
      case 'order': return '🛒';
      case 'user': return '👤';
      case 'message': return '✉️';
      default: return '🔔';
    }
  };

  // Tipə görə başlıq
  const getTypeTitle = (type) => {
    switch(type) {
      case 'order': return 'Sifariş Məlumatları';
      case 'user': return 'İstifadəçi Məlumatları';
      case 'message': return 'Mesaj Məlumatları';
      default: return 'Bildiriş Məlumatları';
    }
  };

  return (
    <div className="notification-details">
      {/* Header hissəsi */}
      <div className="details-header">
        <div className="details-title">
          <span className="details-icon">{getTypeIcon(type)}</span>
          <h2>{title}</h2>
        </div>
        <button 
          className="delete-btn" 
          onClick={() => onDelete(notification.id)}
          title="Bildirişi sil"
        >
          🗑️
        </button>
      </div>

      {/* Meta məlumatlar */}
      <div className="details-meta">
        <div className="meta-row">
          <div className="meta-item">
            <span className="meta-label">Göndərən:</span>
            <span className="meta-value">{user}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Vaxt:</span>
            <span className="meta-value">{time}</span>
          </div>
        </div>
        <div className="meta-row">
          <div className="meta-item">
            <span className="meta-label">Mesaj:</span>
            <span className="meta-value message-text">{message}</span>
          </div>
        </div>
        <div className="meta-row">
          <div className="meta-item">
            <span className="meta-label">Prioritet:</span>
            <div className="meta-value">{getPriorityBadge(priority)}</div>
          </div>
        </div>
      </div>

      {/* Sifariş detalları */}
      {type === 'order' && details && (
        <div className="details-content">
          <h3>{getTypeTitle(type)}</h3>
          
          <div className="details-section">
            <h4>Sifariş №: {details.orderId}</h4>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Müştəri:</label>
                <span>{details.customer}</span>
              </div>
              <div className="info-item">
                <label>Ümumi məbləğ:</label>
                <span className="amount">{details.amount} ₼</span>
              </div>
            </div>
          </div>

          {details.customerInfo && (
            <div className="details-section">
              <h4>Müştəri Məlumatları</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>Ad:</label>
                  <span>{details.customerInfo.name}</span>
                </div>
                <div className="info-item">
                  <label>Telefon:</label>
                  <span>{details.customerInfo.phone}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{details.customerInfo.email}</span>
                </div>
                <div className="info-item full-width">
                  <label>Ünvan:</label>
                  <span>{details.customerInfo.address}</span>
                </div>
              </div>
            </div>
          )}

          {details.products && (
            <div className="details-section">
              <h4>Məhsullar</h4>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Məhsul</th>
                    <th>Say</th>
                    <th>Qiymət</th>
                    <th>Cəmi</th>
                  </tr>
                </thead>
                <tbody>
                  {details.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price} ₼</td>
                      <td>{product.quantity * product.price} ₼</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="total-label">Ümumi:</td>
                    <td className="total-value">{details.amount} ₼</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      {/* İstifadəçi detalları */}
      {type === 'user' && details && (
        <div className="details-content">
          <h3>{getTypeTitle(type)}</h3>
          
          <div className="details-section">
            <div className="info-grid">
              <div className="info-item">
                <label>İstifadəçi ID:</label>
                <span>{details.userId}</span>
              </div>
              <div className="info-item">
                <label>Ad:</label>
                <span>{details.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{details.email}</span>
              </div>
              <div className="info-item">
                <label>Telefon:</label>
                <span>{details.phone || 'Qeyd edilməyib'}</span>
              </div>
              <div className="info-item">
                <label>Qeydiyyat:</label>
                <span>{details.registeredAt}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mesaj detalları */}
      {type === 'message' && details && (
        <div className="details-content">
          <h3>{getTypeTitle(type)}</h3>
          
          <div className="details-section">
            <div className="info-grid">
              <div className="info-item">
                <label>Mesaj ID:</label>
                <span>{details.messageId}</span>
              </div>
              <div className="info-item">
                <label>Göndərən:</label>
                <span>{details.from}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{details.email}</span>
              </div>
              <div className="info-item full-width">
                <label>Mövzu:</label>
                <span className="subject">{details.subject}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h4>Mesaj mətni</h4>
            <div className="message-content">
              <p>{details.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Əməliyyat düymələri */}
      <div className="details-actions">
        <button className="action-button primary">
          {type === 'order' && 'Sifarişə bax'}
          {type === 'user' && 'İstifadəçi profili'}
          {type === 'message' && 'Cavabla'}
        </button>
        <button className="action-button secondary" onClick={() => onDelete(notification.id)}>
          Sil
        </button>
      </div>
    </div>
  );
};

export default NotificationDetails;