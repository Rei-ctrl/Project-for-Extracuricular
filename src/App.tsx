import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { UIProvider, useUI } from './context/UIContext';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSheet from './components/CartSheet';
import LoginModal from './components/LoginModal';

function AppContent() {
  const { isCartOpen, closeCart } = useCart();
  const { isLoginModalOpen, closeLogin } = useUI();
  
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <CartSheet isOpen={isCartOpen} onClose={closeCart} />
        <LoginModal isOpen={isLoginModalOpen} onClose={closeLogin} />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
