import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Order } from '../types';
import { formatCurrency, cn, formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import { User, Package, History, LogOut, ArrowRight, UserCircle2, ShieldCheck, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout, auth } from '../lib/firebase';
import { updatePassword } from 'firebase/auth';

const Dashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const isGoogleUser = user?.providerData.some(p => p.providerId === 'google.com');
  const hasPasswordProvider = user?.providerData.some(p => p.providerId === 'password');

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Kata sandi minimal 6 karakter.' });
      return;
    }

    setPasswordLoading(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setPasswordMessage({ type: 'success', text: 'Kata sandi berhasil dibuat! Anda sekarang bisa masuk dengan email & sandi ini.' });
        setNewPassword('');
      }
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setPasswordMessage({ type: 'error', text: 'Sesi habis. Silakan keluar dan masuk kembali untuk mengatur kata sandi.' });
      } else {
        setPasswordMessage({ type: 'error', text: error.message });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (authLoading) return <div className="p-12 text-center">Loading...</div>;
  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <UserCircle2 size={64} className="text-slate-200 mb-6" />
      <h2 className="text-3xl font-bold tracking-tight mb-2">Silakan Masuk</h2>
      <p className="text-slate-500 mb-8">Masuk untuk melihat profil dan riwayat pesanan Anda.</p>
    </div>
  );

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Sidebar Profile */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sticky top-24 shadow-sm">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 border-white shadow-xl shadow-slate-200">
                 {user.photoURL ? (
                   <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                 ) : (
                   <User size={40} className="text-slate-300" />
                 )}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">{userProfile?.displayName || 'Pelanggan'}</h2>
              <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mt-1 font-mono">{user.email}</p>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all text-left">
                <span className="flex items-center"><User size={16} className="mr-3" /> Profil & Pesanan</span>
                <ArrowRight size={14} />
              </button>
              
              {isGoogleUser && !hasPasswordProvider && (
                <div className="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="flex items-center gap-2 text-orange-700 mb-2">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Lengkapi Akun</span>
                  </div>
                  <p className="text-[10px] text-orange-600 leading-relaxed mb-3">
                    Anda masuk via Google. Ingin bisa masuk dengan kata sandi manual? Buat sandi Anda di bawah.
                  </p>
                  <form onSubmit={handleSetPassword} className="space-y-2">
                    <input 
                      type="password" 
                      placeholder="Sandi Baru"
                      className="w-full p-3 bg-white border border-orange-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-200"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button 
                      disabled={passwordLoading}
                      className="w-full py-2.5 bg-orange-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-sm disabled:opacity-50"
                    >
                      {passwordLoading ? 'Proses...' : 'Set Kata Sandi'}
                    </button>
                  </form>
                  {passwordMessage.text && (
                    <p className={cn(
                      "text-[9px] mt-2 font-bold",
                      passwordMessage.type === 'success' ? "text-emerald-600" : "text-red-500"
                    )}>
                      {passwordMessage.text}
                    </p>
                  )}
                </div>
              )}

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all text-left"
              >
                <span className="flex items-center"><LogOut size={16} className="mr-3" /> Keluar</span>
                <ArrowRight size={14} />
              </button>
            </div>
            
            {userProfile?.role === 'admin' && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <button 
                  onClick={() => navigate('/admin')}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Buka Panel Admin
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          <section>
            <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-6">
              <div>
                <h3 className="text-4xl font-light text-slate-800 tracking-tight leading-none">
                  Riwayat <span className="font-bold text-black">Pesanan</span>
                </h3>
                <p className="text-slate-500 mt-2 text-sm">Lihat status dan detail koleksi pesanan Anda.</p>
              </div>
              <div className="flex bg-white border border-slate-200 rounded-xl p-1">
                <button className="px-4 py-2 bg-slate-50 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">Terbaru</button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl border border-slate-200" />
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <motion.div 
                    key={order.id}
                    className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:shadow-slate-200 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono mb-1">Order ID / {order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                        order.status === 'delivered' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                      )}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{order.items.length} Instrumen Terlampir</p>
                      <p className="text-xl font-bold text-indigo-600">{formatCurrency(order.totalPrice)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl p-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <Package size={32} />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Belum ada pesanan</h4>
                <p className="text-slate-400 text-xs max-w-xs mx-auto mb-8 leading-relaxed">
                  Mulailah merangkai kreativitas Anda dengan koleksi stationery pilihan kami.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                >
                  Jelajahi Marketplace
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
