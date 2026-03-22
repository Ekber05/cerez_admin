import { useState, useEffect, useCallback } from 'react';

// Ortaq mock data generator
const generateMockOrders = () => {
  const statuses = ['completed', 'pending', 'processing', 'cancelled'];
  const customers = [
    'Əli Məmmədov', 'Aysel Hüseynova', 'Kamran Əliyev', 
    'Nigar Səmədova', 'Rəşad Əliyev', 'Leyla Məmmədova',
    'Anar Hüseynov', 'Günel Səmədova', 'Tural Əliyev',
    'Aygün Məmmədova', 'Orxan Hüseynov', 'Nərmin Əliyeva'
  ];
  
  const today = new Date();
  const todayStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
  
  return Array.from({ length: 45 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = Math.floor(Math.random() * 200) + 20 + Math.random();
    
    // Bəzi sifarişləri bugünə aid et
    const isToday = Math.random() > 0.7; // 30% bugünkü sifariş
    
    const day = isToday ? today.getDate() : Math.floor(Math.random() * 28) + 1;
    const month = isToday ? today.getMonth() + 1 : Math.floor(Math.random() * 12) + 1;
    const year = isToday ? today.getFullYear() : 2026;
    
    const hour = Math.floor(Math.random() * 23);
    const minute = Math.floor(Math.random() * 59);
    
    const operator = ['50', '55', '70', '77', '51', '99'][Math.floor(Math.random() * 6)];
    const number1 = Math.floor(Math.random() * 900) + 100;
    const number2 = Math.floor(Math.random() * 90) + 10;
    const number3 = Math.floor(Math.random() * 90) + 10;
    
    return {
      id: `#${12345 + i}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      phone: `+994 ${operator} ${number1} ${number2} ${number3}`,
      date: `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`,
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      amount: parseFloat(amount.toFixed(2)),
      currency: 'AZN',
      status: status,
      items: Math.floor(Math.random() * 8) + 1,
      paymentMethod: Math.random() > 0.5 ? 'Kart' : 'Nağd',
      address: `Bakı şəh., Nəsimi r-nu, ${Math.floor(Math.random() * 100)} mənzil`,
      note: Math.random() > 0.7 ? 'Qeyd: Zəng edib təsdiqləyin' : ''
    };
  }).sort((a, b) => {
    // Tarixə görə sırala (ən yenilər əvvəldə)
    const [aDay, aMonth, aYear] = a.date.split('.');
    const [bDay, bMonth, bYear] = b.date.split('.');
    const aDate = new Date(aYear, aMonth - 1, aDay);
    const bDate = new Date(bYear, bMonth - 1, bDay);
    return bDate - aDate;
  });
};

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date();
  const todayStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Backend olmadığı üçün mock data
    setTimeout(() => {
      try {
        const mockOrders = generateMockOrders();
        setOrders(mockOrders);
        
        // Bugünkü sifarişləri filterlə
        const today = mockOrders.filter(order => order.date === todayStr);
        setTodayOrders(today);
        
        setLoading(false);
      } catch (err) {
        setError('Sifarişlər yüklənərkən xəta baş verdi');
        setLoading(false);
      }
    }, 500);
  }, [todayStr]);

  const refreshOrders = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = useCallback((newOrder) => {
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      
      // Bugünkü sifarişləri yenilə
      const today = updated.filter(order => order.date === todayStr);
      setTodayOrders(today);
      
      return updated;
    });
  }, [todayStr]);

  const updateOrder = useCallback((orderId, updatedData) => {
    setOrders(prev => {
      const updated = prev.map(order => 
        order.id === orderId ? { ...order, ...updatedData } : order
      );
      
      // Bugünkü sifarişləri yenilə
      const today = updated.filter(order => order.date === todayStr);
      setTodayOrders(today);
      
      return updated;
    });
  }, [todayStr]);

  const deleteOrder = useCallback((orderId) => {
    setOrders(prev => {
      const updated = prev.filter(order => order.id !== orderId);
      
      // Bugünkü sifarişləri yenilə
      const today = updated.filter(order => order.date === todayStr);
      setTodayOrders(today);
      
      return updated;
    });
  }, [todayStr]);

  const calculateStats = useCallback(() => {
    const total = orders.length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
    
    return { total, completed, pending, processing, cancelled, totalAmount };
  }, [orders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    todayOrders,
    loading,
    error,
    refreshOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    calculateStats,
    todayStr
  };
};