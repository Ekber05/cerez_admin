import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/AdminLogin1/AdminLogin";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import AllOrders from "./pages/AdminPanel/components/AllOrders";
import ProductList from "./pages/AdminPanel/components/ProductList";
import ProductUpload from "./pages/AdminPanel/components/ProductUpload";
import ProfileContent from "./pages/AdminPanel/components/ProfileContent";
import Dashboard from "./pages/AdminPanel/components/Dashboard";
import MessageSection from "./pages/AdminPanel/components/MessageSection/MessageSection";
import NotificationsPage from "./pages/AdminPanel/components/notifications/NotificationsPage";
import Campaigns from "./pages/AdminPanel/components/Campaigns";
import Blog from "./pages/AdminPanel/components/Blog";
import { ProductProvider } from "./contexts/ProductContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import "./App.css";

// BOŞ SƏHİFƏLƏR ÜÇÜN SADƏ KOMPONENTLƏR
const AuthenticationPlaceholder = () => <div>Authentication səhifəsi hazırlanır</div>;
const UsersPlaceholder = () => <div>Users səhifəsi hazırlanır</div>;
const InvoicesPlaceholder = () => <div>Invoices səhifəsi hazırlanır</div>;
const SettingsPlaceholder = () => <div>Settings səhifəsi hazırlanır</div>;
const BlankPagePlaceholder = () => <div>Blank Page səhifəsi hazırlanır</div>;

function App() {
  // İstifadəçinin login olub-olmadığını yoxlayan funksiya
  const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
  };

  // Qorunan route komponenti
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <ProductProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* DƏYİŞDİ: Login səhifəsi - artıq login olmuşsa dashboard-a yönləndir */}
            <Route 
              path="/login" 
              element={
                isAuthenticated() ? 
                <Navigate to="/admin/dashboard" replace /> : 
                <AdminLogin />
              } 
            />
            
            {/* DƏYİŞDİ: Ana səhifə - hər zaman login-ə yönləndir */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Admin Panel - Ana layout */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }>
              {/* Alt route-lar */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<AllOrders />} />
              <Route path="products/list" element={<ProductList />} />
              <Route path="products/upload" element={<ProductUpload />} />
              <Route path="profile" element={<ProfileContent />} />
              <Route path="messages" element={<MessageSection />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="blog" element={<Blog />} />
              <Route path="authentication" element={<AuthenticationPlaceholder />} />
              <Route path="users" element={<UsersPlaceholder />} />
              <Route path="invoices" element={<InvoicesPlaceholder />} />
              <Route path="settings" element={<SettingsPlaceholder />} />
              <Route path="blank" element={<BlankPagePlaceholder />} />
            </Route>
            
            {/* 404 səhifəsi - login-ə yönləndir */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ProductProvider>
  );
}

export default App;