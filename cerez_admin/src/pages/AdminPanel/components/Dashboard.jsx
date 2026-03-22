// Dashboard.jsx - Fərdiləşdirilmiş Class Adları ilə
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { 
  FiDollarSign, FiShoppingBag, FiUsers, FiClock, 
  FiPackage, FiCreditCard, FiMapPin, FiAlertCircle,
  FiDownload, FiCalendar, FiTrendingUp, FiTrendingDown,
  FiRefreshCw, FiUserCheck, FiActivity, FiChevronLeft, 
  FiChevronRight, FiChevronsLeft, FiChevronsRight
} from 'react-icons/fi';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart
} from 'recharts';

const Dashboard = () => {
  // ========== STATE ==========
  const [dateRange, setDateRange] = useState('7days');
  const [loading, setLoading] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);

  const [salesData, setSalesData] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalRevenue: 458900,
    totalOrders: 4589,
    activeCustomers: 1245,
    averageOrderValue: 100,
    pendingOrders: 45,
    revenueGrowth: 11.2,
    ordersGrowth: 10.5
  });
  const [topProducts, setTopProducts] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [stockAnalytics, setStockAnalytics] = useState({
    lowStock: [],
    outOfStock: [],
    highTurnover: []
  });

  // ========== MOCK DATA ==========
  const mockSalesData = {
    '7days': [
      { name: '1 May', revenue: 4500, orders: 45 },
      { name: '2 May', revenue: 5200, orders: 52 },
      { name: '3 May', revenue: 4800, orders: 48 },
      { name: '4 May', revenue: 6100, orders: 61 },
      { name: '5 May', revenue: 5900, orders: 59 },
      { name: '6 May', revenue: 6700, orders: 67 },
      { name: '7 May', revenue: 7200, orders: 72 },
    ],
    '30days': [
      { name: 'Həftə 1', revenue: 28500, orders: 285 },
      { name: 'Həftə 2', revenue: 31200, orders: 312 },
      { name: 'Həftə 3', revenue: 29800, orders: 298 },
      { name: 'Həftə 4', revenue: 34100, orders: 341 },
    ],
    '90days': [
      { name: 'Aprel', revenue: 98500, orders: 985 },
      { name: 'May', revenue: 112400, orders: 1124 },
      { name: 'İyun', revenue: 124800, orders: 1248 },
    ]
  };

  const mockTopProducts = [
    { name: 'Badam', sales: 450, revenue: 8325 },
    { name: 'Fındıq', sales: 380, revenue: 6042 },
    { name: 'Qoz', sales: 320, revenue: 4096 },
    { name: 'Kəşmiş', sales: 290, revenue: 2581 },
    { name: 'Püstə', sales: 240, revenue: 7680 },
  ];

  const mockCustomerData = [
    { name: '1 May', yeni: 45, aktiv: 890, tekrar: 340 },
    { name: '2 May', yeni: 52, aktiv: 920, tekrar: 360 },
    { name: '3 May', yeni: 48, aktiv: 945, tekrar: 380 },
    { name: '4 May', yeni: 61, aktiv: 980, tekrar: 410 },
    { name: '5 May', yeni: 59, aktiv: 1010, tekrar: 435 },
    { name: '6 May', yeni: 67, aktiv: 1150, tekrar: 470 },
    { name: '7 May', yeni: 72, aktiv: 1245, tekrar: 510 },
  ];

  const mockStockAnalytics = {
    lowStock: [
      { name: 'Püstə', stock: 24, threshold: 30, category: 'Çərəzlər' },
      { name: 'Ananas qurusu', stock: 17, threshold: 25, category: 'Quru meyvələr' },
      { name: 'Kivi qurusu', stock: 14, threshold: 20, category: 'Quru meyvələr' },
    ],
    outOfStock: [
      { name: 'Şabalıd', category: 'Çərəzlər' },
    ],
    highTurnover: [
      { name: 'Badam', turnover: 45, category: 'Çərəzlər' },
      { name: 'Fındıq', turnover: 38, category: 'Çərəzlər' },
      { name: 'Kəşmiş', turnover: 29, category: 'Quru meyvələr' },
    ]
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadMockData = (range = dateRange) => {
    setLoading(true);
    setTimeout(() => {
      setSalesData(mockSalesData[range] || mockSalesData['7days']);
      setTopProducts(mockTopProducts);
      setCustomerData(mockCustomerData);
      setStockAnalytics(mockStockAnalytics);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadMockData(dateRange);
  }, [dateRange]);

  const applyDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      setLoading(true);
      setTimeout(() => {
        setSalesData(mockSalesData[dateRange] || mockSalesData['7days']);
        setTopProducts(mockTopProducts);
        setCustomerData(mockCustomerData);
        setStockAnalytics(mockStockAnalytics);
        setLoading(false);
        if (isMobile) {
          setShowCustomDate(false);
        }
      }, 500);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDay = firstDay.getDay();
    startingDay = startingDay === 0 ? 6 : startingDay - 1;
    return { daysInMonth, startingDay };
  };

  const getMonthName = (date) => {
    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
      'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
    ];
    return months[date.getMonth()];
  };

  const goToPreviousMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToPreviousYear = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
  };

  const goToNextYear = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate(null);
      setIsSelecting(true);
    } else if (selectedStartDate && !selectedEndDate && isSelecting) {
      if (selectedDate < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(selectedDate);
      } else {
        setSelectedEndDate(selectedDate);
      }
      setIsSelecting(false);
      
      setTimeout(() => {
        applyDateRange();
      }, 100);
    }
  };

  const isDateInRange = (date) => {
    if (!selectedStartDate) return false;
    const start = selectedStartDate;
    const end = selectedEndDate || hoverDate;
    if (!end) return date.getTime() === start.getTime();
    if (start <= end) {
      return date >= start && date <= end;
    } else {
      return date >= end && date <= start;
    }
  };

  const isStartDate = (date) => {
    return selectedStartDate && date.getTime() === selectedStartDate.getTime();
  };

  const isEndDate = (date) => {
    return selectedEndDate && date.getTime() === selectedEndDate.getTime();
  };

  const closeCalendar = () => {
    setShowCustomDate(false);
  };

  const clearSelectedDates = (e) => {
    if (e) e.stopPropagation();
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setIsSelecting(false);
    setHoverDate(null);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleExport = (type) => {
    let data, filename;
    switch(type) {
      case 'sales':
        data = salesData;
        filename = 'satis_melumatlari';
        break;
      case 'products':
        data = topProducts;
        filename = 'en_cox_satilan_mehsullar';
        break;
      case 'customers':
        data = customerData;
        filename = 'musteri_analitikasi';
        break;
      default:
        return;
    }
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(obj => Object.values(obj).join(','));
    return [headers, ...rows].join('\n');
  };

  const handleRefresh = () => {
    loadMockData(dateRange);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="dash-tooltip">
          <p className="dash-tooltip__label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="dash-tooltip__value" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()} {entry.name.includes('Gəlir') || entry.name.includes('revenue') ? '₼' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
  const weekDays = ['B.E', 'Ç.A', 'Ç', 'C.A', 'C', 'Ş', 'B'];

  if (loading) {
    return (
      <div className="dash">
        <div className="dash-loading">
          <div className="dash-loading__spinner"></div>
          <p>Məlumatlar yenilənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dash">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Elektron Ticarət</h1>
          <p className="dash-header__subtitle">
            Son yenilənmə: {new Date().toLocaleString('az-AZ')}
          </p>
        </div>
        <div className="dash-header__actions">
          <button className="dash-btn dash-btn--refresh" onClick={handleRefresh}>
            <FiRefreshCw /> Yenilə
          </button>
          <button className="dash-btn dash-btn--export" onClick={() => handleExport('sales')}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Tarix filtrləri */}
      <div className="dash-date-filter">
        <div className="dash-date-filter__buttons">
          <button 
            className={`dash-date-filter__btn ${dateRange === '7days' && !selectedStartDate ? 'dash-date-filter__btn--active' : ''}`}
            onClick={() => handleDateRangeChange('7days')}
          >
            Son 7 gün
          </button>
          <button 
            className={`dash-date-filter__btn ${dateRange === '30days' && !selectedStartDate ? 'dash-date-filter__btn--active' : ''}`}
            onClick={() => handleDateRangeChange('30days')}
          >
            Son 30 gün
          </button>
          <button 
            className={`dash-date-filter__btn ${dateRange === '90days' && !selectedStartDate ? 'dash-date-filter__btn--active' : ''}`}
            onClick={() => handleDateRangeChange('90days')}
          >
            Son 90 gün
          </button>
        </div>
      </div>

      {/* KPI və Təqvim */}
      <div className="dash-row">
        {/* KPI Kartları */}
        <div className="dash-kpis">
          <div className="dash-kpis__row dash-kpis__row--top">
            <div className="dash-kpi-card">
              <div className="dash-kpi-card__icon dash-kpi-card__icon--revenue">
                <FiDollarSign />
              </div>
              <div className="dash-kpi-card__content">
                <span className="dash-kpi-card__label">Ümumi gəlir</span>
                <span className="dash-kpi-card__value">₼{kpiData.totalRevenue.toLocaleString()}</span>
                <span className={`dash-kpi-card__trend ${kpiData.revenueGrowth > 0 ? 'dash-kpi-card__trend--positive' : 'dash-kpi-card__trend--negative'}`}>
                  {kpiData.revenueGrowth > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                  {Math.abs(kpiData.revenueGrowth)}%
                </span>
              </div>
            </div>

            <div className="dash-kpi-card">
              <div className="dash-kpi-card__icon dash-kpi-card__icon--orders">
                <FiShoppingBag />
              </div>
              <div className="dash-kpi-card__content">
                <span className="dash-kpi-card__label">Ümumi sifariş</span>
                <span className="dash-kpi-card__value">{kpiData.totalOrders.toLocaleString()}</span>
                <span className={`dash-kpi-card__trend ${kpiData.ordersGrowth > 0 ? 'dash-kpi-card__trend--positive' : 'dash-kpi-card__trend--negative'}`}>
                  {kpiData.ordersGrowth > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                  {Math.abs(kpiData.ordersGrowth)}%
                </span>
              </div>
            </div>

            <div className="dash-kpi-card">
              <div className="dash-kpi-card__icon dash-kpi-card__icon--customers">
                <FiUsers />
              </div>
              <div className="dash-kpi-card__content">
                <span className="dash-kpi-card__label">Aktiv müştəri</span>
                <span className="dash-kpi-card__value">{kpiData.activeCustomers.toLocaleString()}</span>
                <span className="dash-kpi-card__trend dash-kpi-card__trend--positive">
                  <FiUserCheck /> +128
                </span>
              </div>
            </div>
          </div>

          <div className="dash-kpis__row dash-kpis__row--bottom">
            <div className="dash-kpi-card">
              <div className="dash-kpi-card__icon dash-kpi-card__icon--avg-order">
                <FiActivity />
              </div>
              <div className="dash-kpi-card__content">
                <span className="dash-kpi-card__label">Orta sifariş</span>
                <span className="dash-kpi-card__value">₼{kpiData.averageOrderValue}</span>
                <span className="dash-kpi-card__trend dash-kpi-card__trend--positive">
                  <FiTrendingUp /> 5%
                </span>
              </div>
            </div>

            <div className="dash-kpi-card">
              <div className="dash-kpi-card__icon dash-kpi-card__icon--pending">
                <FiClock />
              </div>
              <div className="dash-kpi-card__content">
                <span className="dash-kpi-card__label">Gözləyən</span>
                <span className="dash-kpi-card__value">{kpiData.pendingOrders}</span>
                <span className="dash-kpi-card__trend dash-kpi-card__trend--warning">
                  <FiAlertCircle /> Təcili
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Təqvim */}
        {!isMobile && (
          <div className="dash-calendar">
            <div className="dash-calendar__container">
              <div className="dash-calendar__header">
                <div className="dash-calendar__month-year">
                  <span className="dash-calendar__month">{getMonthName(currentMonth)}</span>
                  <span className="dash-calendar__year">{currentMonth.getFullYear()}</span>
                </div>
                <div className="dash-calendar__nav">
                  <button onClick={goToPreviousYear} className="dash-calendar__nav-btn" title="Əvvəlki il">
                    <FiChevronsLeft />
                  </button>
                  <button onClick={goToPreviousMonth} className="dash-calendar__nav-btn" title="Əvvəlki ay">
                    <FiChevronLeft />
                  </button>
                  <button onClick={goToNextMonth} className="dash-calendar__nav-btn" title="Növbəti ay">
                    <FiChevronRight />
                  </button>
                  <button onClick={goToNextYear} className="dash-calendar__nav-btn" title="Növbəti il">
                    <FiChevronsRight />
                  </button>
                </div>
              </div>

              <div className="dash-calendar__weekdays">
                {weekDays.map((day, index) => (
                  <div key={index} className="dash-calendar__weekday">{day}</div>
                ))}
              </div>

              <div className="dash-calendar__days">
                {Array.from({ length: startingDay }).map((_, index) => (
                  <div key={`empty-${index}`} className="dash-calendar__day dash-calendar__day--empty"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const isSelected = isDateInRange(date);
                  const isStart = isStartDate(date);
                  const isEnd = isEndDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  let dayClass = 'dash-calendar__day';
                  if (isSelected) dayClass += ' dash-calendar__day--selected';
                  if (isStart) dayClass += ' dash-calendar__day--start';
                  if (isEnd) dayClass += ' dash-calendar__day--end';
                  if (isToday) dayClass += ' dash-calendar__day--today';

                  return (
                    <div
                      key={day}
                      className={dayClass}
                      onClick={() => handleDateClick(day)}
                      onMouseEnter={() => isSelecting && !selectedEndDate && setHoverDate(date)}
                      onMouseLeave={() => setHoverDate(null)}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {selectedStartDate && selectedEndDate && (
                <div className="dash-calendar__range-info">
                  <span>{formatDisplayDate(selectedStartDate)} - {formatDisplayDate(selectedEndDate)}</span>
                </div>
              )}

              <button className="dash-calendar__clear-btn" onClick={clearSelectedDates}>
                Təmizlə
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobil üçün təqvim */}
      {isMobile && (
        <div className="dash-mobile-calendar">
          <button 
            className="dash-mobile-calendar__btn"
            onClick={() => setShowCustomDate(!showCustomDate)}
          >
            <FiCalendar /> Təqvim
          </button>
          
          {showCustomDate && (
            <div className="dash-mobile-calendar__picker">
              <div className="dash-calendar__container dash-calendar__container--mobile">
                <div className="dash-calendar__header">
                  <div className="dash-calendar__month-year">
                    <span className="dash-calendar__month">{getMonthName(currentMonth)}</span>
                    <span className="dash-calendar__year">{currentMonth.getFullYear()}</span>
                  </div>
                  <div className="dash-calendar__nav">
                    <button onClick={goToPreviousYear} className="dash-calendar__nav-btn">
                      <FiChevronsLeft />
                    </button>
                    <button onClick={goToPreviousMonth} className="dash-calendar__nav-btn">
                      <FiChevronLeft />
                    </button>
                    <button onClick={goToNextMonth} className="dash-calendar__nav-btn">
                      <FiChevronRight />
                    </button>
                    <button onClick={goToNextYear} className="dash-calendar__nav-btn">
                      <FiChevronsRight />
                    </button>
                  </div>
                </div>

                <div className="dash-calendar__weekdays">
                  {weekDays.map((day, index) => (
                    <div key={index} className="dash-calendar__weekday">{day}</div>
                  ))}
                </div>

                <div className="dash-calendar__days">
                  {Array.from({ length: startingDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="dash-calendar__day dash-calendar__day--empty"></div>
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const isSelected = isDateInRange(date);
                    const isStart = isStartDate(date);
                    const isEnd = isEndDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    let dayClass = 'dash-calendar__day';
                    if (isSelected) dayClass += ' dash-calendar__day--selected';
                    if (isStart) dayClass += ' dash-calendar__day--start';
                    if (isEnd) dayClass += ' dash-calendar__day--end';
                    if (isToday) dayClass += ' dash-calendar__day--today';

                    return (
                      <div
                        key={day}
                        className={dayClass}
                        onClick={() => handleDateClick(day)}
                        onMouseEnter={() => isSelecting && !selectedEndDate && setHoverDate(date)}
                        onMouseLeave={() => setHoverDate(null)}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>

                {selectedStartDate && selectedEndDate && (
                  <div className="dash-calendar__range-info">
                    <span>{formatDisplayDate(selectedStartDate)} - {formatDisplayDate(selectedEndDate)}</span>
                  </div>
                )}

                <div className="dash-calendar__footer">
                  <button className="dash-calendar__clear-btn" onClick={clearSelectedDates}>
                    Təmizlə
                  </button>
                  <button className="dash-calendar__close-btn" onClick={closeCalendar}>
                    Bağla
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Satış Qrafiki */}
      <div className="dash-chart">
        <div className="dash-chart__header">
          <h2 className="dash-chart__title">📊 Satış qrafiki</h2>
          <div className="dash-chart__legend">
            <span className="dash-chart__legend-item">
              <span className="dash-chart__legend-color dash-chart__legend-color--revenue"></span>
              Gəlir (₼)
            </span>
            <span className="dash-chart__legend-item">
              <span className="dash-chart__legend-color dash-chart__legend-color--orders"></span>
              Sifariş
            </span>
          </div>
        </div>
        <div className="dash-chart__wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="right" dataKey="orders" fill="#3498db" name="Sifariş" barSize={30} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#2ecc71" strokeWidth={3} name="Gəlir" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* İkili qrafik sırası */}
      <div className="dash-charts-row">
        <div className="dash-chart dash-chart--half">
          <div className="dash-chart__header">
            <h2 className="dash-chart__title">🛒 Ən çox satılanlar</h2>
            <button className="dash-btn dash-btn--small" onClick={() => handleExport('products')}>
              <FiDownload /> Export
            </button>
          </div>
          <div className="dash-chart__wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="sales" fill="#f39c12" name="Satış" />
                <Bar dataKey="revenue" fill="#e67e22" name="Gəlir" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-chart dash-chart--half">
          <div className="dash-chart__header">
            <h2 className="dash-chart__title">👥 Müştəri analitikası</h2>
          </div>
          <div className="dash-chart__wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="yeni" stroke="#3498db" name="Yeni" />
                <Line type="monotone" dataKey="aktiv" stroke="#2ecc71" name="Aktiv" />
                <Line type="monotone" dataKey="tekrar" stroke="#f39c12" name="Təkrar" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stok analitikası */}
      <div className="dash-stock">
        <h2 className="dash-stock__title">📦 Stok analitikası</h2>
        <div className="dash-stock__grid">
          <div className="dash-stock__section">
            <h3 className="dash-stock__section-title">⚠️ Az qalan məhsullar</h3>
            <table className="dash-stock__table">
              <thead>
                <tr>
                  <th>Məhsul</th>
                  <th>Kateqoriya</th>
                  <th>Stok</th>
                  <th>Limit</th>
                </tr>
              </thead>
              <tbody>
                {stockAnalytics.lowStock.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td className="dash-stock__table--warning">{item.stock}</td>
                    <td>{item.threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dash-stock__section">
            <h3 className="dash-stock__section-title">❌ Bitmiş məhsullar</h3>
            <table className="dash-stock__table">
              <thead>
                <tr>
                  <th>Məhsul</th>
                  <th>Kateqoriya</th>
                </tr>
              </thead>
              <tbody>
                {stockAnalytics.outOfStock.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dash-stock__section">
            <h3 className="dash-stock__section-title">🔥 Ən çox dövriyyə</h3>
            <table className="dash-stock__table">
              <thead>
                <tr>
                  <th>Məhsul</th>
                  <th>Kateqoriya</th>
                  <th>Dövriyyə</th>
                </tr>
              </thead>
              <tbody>
                {stockAnalytics.highTurnover.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.turnover}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;