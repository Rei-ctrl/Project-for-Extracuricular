import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogIn, Settings, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { logout } from '../lib/firebase';
import { motion } from 'motion/react';

const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const { totalItems, openCart } = useCart();
  const { openLogin, searchQuery, setSearchQuery } = useUI();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-[100] backdrop-blur-md">
      <div className="flex items-center gap-8 lg:gap-12">
        <Link to="/" className="flex items-center flex-shrink-0">
          <div className="text-2xl font-black tracking-tighter text-indigo-700">TULIS<span className="text-slate-400 font-light">HUB</span></div>
        </Link>
        <div className="hidden md:flex gap-6 lg:gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Marketplace</Link>
          <a href="#categories" className="hover:text-indigo-600 transition-colors">Koleksi</a>
        </div>

        {/* Global Search */}
        <div className="relative flex-grow max-w-md hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari instrumen tulis..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-indigo-100 rounded-2xl py-2.5 pl-12 pr-4 text-xs font-medium transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="lg:hidden">
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
             <Search size={20} />
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Terpantau</span>
        </div>
        
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 sm:pl-6">
          <button 
            onClick={openCart}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors relative"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>
          
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-2xl transition-colors border border-transparent hover:border-slate-200">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold text-xs">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </button>
              
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110]">
                <div className="w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Akun Terhubung</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <User size={18} /> Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                        <Settings size={18} /> Admin Panel
                      </Link>
                    )}
                    <div className="h-px bg-slate-100 my-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={18} /> Keluar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={openLogin}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <LogIn size={16} />
              <span>Masuk</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
