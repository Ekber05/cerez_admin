import React, { useState, useEffect, useRef } from 'react';
import './MessageSection.css';

const MessageSection = () => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showMobileUsers, setShowMobileUsers] = useState(true); // Dəyişiklik: default true
  const messagesEndRef = useRef(null);
  
  // İstifadəçi məlumatları
  const [users] = useState([
    { 
      id: 1, 
      name: 'Miron Mahmud', 
      active: true, 
      lastMsg: 'whats your current career o...', 
      time: '03',
      avatar: 'M',
      avatarColor: '#4F46E5',
      lastSeen: 'active now'
    },
    { 
      id: 2, 
      name: 'Tahmina Bonny', 
      active: false, 
      lastMsg: 'whats your current career opport...', 
      time: '3m',
      avatar: 'T',
      avatarColor: '#059669',
      lastSeen: '~3m'
    },
    { 
      id: 3, 
      name: 'Labonno Khan', 
      active: false, 
      lastMsg: 'whats your current career o...', 
      time: '5h',
      avatar: 'L',
      avatarColor: '#DC2626',
      lastSeen: '~5h',
      unread: '01'
    },
    { 
      id: 4, 
      name: 'Shipon Ahmed', 
      active: false, 
      lastMsg: 'whats your current career opport...', 
      time: '7d',
      avatar: 'S',
      avatarColor: '#7C3AED',
      lastSeen: '~7d'
    },
    { 
      id: 5, 
      name: 'Rabeya Akter', 
      active: false, 
      lastMsg: 'whats your current career opport...', 
      time: '9s',
      avatar: 'R',
      avatarColor: '#DB2777',
      lastSeen: '~9s'
    },
    { 
      id: 6, 
      name: 'Shah Nasrullah', 
      active: false, 
      lastMsg: 'whats your current career opport...', 
      time: '4w',
      avatar: 'S',
      avatarColor: '#EA580C',
      lastSeen: '~4w'
    }
  ]);

  // Mesaj məlumatları
  const [messages, setMessages] = useState({
    1: [
      { 
        id: 1, 
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo dolore animi dolores autem assumenda fuga consequuntur, laboriosam laborum minus provident error officia quasi atque deleniti.', 
        time: '2 minute ago!', 
        sender: 'them',
        senderName: 'Miron Mahmud'
      },
      { 
        id: 2, 
        text: 'Omnis dolorum tempora consequatur', 
        time: '2 minute ago!', 
        sender: 'me',
        senderName: 'You'
      },
      { 
        id: 3, 
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolorum tempora consequatur. Deleniti nisi libero!', 
        time: '2 minute ago!', 
        sender: 'them',
        senderName: 'Miron Mahmud'
      },
      { 
        id: 4, 
        text: 'Omnis dolorum tempora consequatur', 
        time: '2 minute ago!', 
        sender: 'me',
        senderName: 'You'
      },
    ],
  });

  // Mobil görünüşdə user seçildikdə siyahını gizlət
  useEffect(() => {
    if (window.innerWidth <= 768 && selectedUser) {
      setShowMobileUsers(false);
    }
  }, [selectedUser]);

  // Ekran ölçüsü dəyişəndə
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowMobileUsers(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mesajlara auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  // Axtarış filteri
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Mesaj göndərmə
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      time: 'just now',
      sender: 'me',
      senderName: 'You'
    };

    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMsg],
    }));

    setNewMessage('');
  };

  // Enter ilə göndərmə
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mobil geri düyməsi
  const handleBackToUsers = () => {
    setShowMobileUsers(true);
    setSelectedUser(null);
  };

  // User seç
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (window.innerWidth <= 768) {
      setShowMobileUsers(false);
    }
  };

  return (
    <div className="ms-message-section">
      {/* Sol Panel - İstifadəçi Siyahısı */}
      <div className={`ms-users-panel ${showMobileUsers ? 'ms-active' : ''}`}>
        <div className="ms-users-panel-header">
          <h2 className="ms-users-panel-title">Messages</h2>
          <div className="ms-search-container">
            <span className="ms-search-icon">🔍</span>
            <input
              type="text"
              placeholder="search username"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ms-search-input"
            />
          </div>
        </div>

        <div className="ms-users-list">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={`ms-user-item ${selectedUser?.id === user.id ? 'ms-user-item-active' : ''}`}
              onClick={() => handleSelectUser(user)}
            >
              <div className="ms-user-avatar-container">
                <div 
                  className="ms-user-avatar"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.avatar}
                </div>
                {user.active && <span className="ms-active-indicator"></span>}
              </div>
              <div className="ms-user-info">
                <div className="ms-user-info-header">
                  <span className="ms-user-name">{user.name}</span>
                  <span className="ms-message-time">{user.time}</span>
                </div>
                <div className="ms-user-info-footer">
                  <p className="ms-last-message">{user.lastMsg}</p>
                  {user.unread && (
                    <span className="ms-unread-badge">{user.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sağ Panel - Söhbət Bölməsi */}
      <div className={`ms-chat-panel ${!showMobileUsers && selectedUser ? 'ms-active' : ''}`}>
        {selectedUser ? (
          <>
            {/* Chat Header - HƏMİŞƏ GÖRÜNƏCƏK */}
            <div className="ms-chat-header">
              <button className="ms-mobile-back-btn" onClick={handleBackToUsers}>
                ←
              </button>
              <div className="ms-chat-user-info">
                <div className="ms-chat-user-avatar-container">
                  <div 
                    className="ms-chat-user-avatar"
                    style={{ backgroundColor: selectedUser.avatarColor }}
                  >
                    {selectedUser.avatar}
                  </div>
                  {selectedUser.active && <span className="ms-active-indicator"></span>}
                </div>
                <div className="ms-chat-user-details">
                  <h3 className="ms-chat-user-name">{selectedUser.name}</h3>
                  <span className="ms-chat-user-status">
                    {selectedUser.active ? 'active now' : selectedUser.lastSeen}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="ms-messages-area">
              {messages[selectedUser.id]?.map(message => (
                <div key={message.id} className="ms-message-container">
                  <div
                    className={`ms-message-wrapper ${
                      message.sender === 'me' ? 'ms-message-wrapper-me' : 'ms-message-wrapper-them'
                    }`}
                  >
                    {message.sender === 'them' && (
                      <div 
                        className="ms-message-avatar"
                        style={{ backgroundColor: selectedUser.avatarColor }}
                      >
                        {selectedUser.avatar}
                      </div>
                    )}
                    <div
                      className={`ms-message-bubble ${
                        message.sender === 'me' ? 'ms-message-bubble-me' : 'ms-message-bubble-them'
                      }`}
                    >
                      <p className="ms-message-text">{message.text}</p>
                      <span className={`ms-message-time-stamp ${
                        message.sender === 'me' ? 'ms-message-time-stamp-me' : 'ms-message-time-stamp-them'
                      }`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="ms-message-input-container">
              <input
                type="text"
                placeholder="type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="ms-message-input"
              />
              <button
                onClick={handleSendMessage}
                className="ms-send-button"
                disabled={!newMessage.trim()}
              >
                📤
              </button>
            </div>
          </>
        ) : (
          <div className="ms-no-chat-selected">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSection;