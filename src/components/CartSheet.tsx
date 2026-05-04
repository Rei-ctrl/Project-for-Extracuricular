import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { formatCurrency } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSheet: React.FC<CartSheetProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const { openLogin } = useUI();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleCheckout = async () => {
    if (!user) {
      onClose();
      openLogin();
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        userEmail: user.email,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        totalPrice,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      clearCart();
      onClose();
      navigate('/dashboard');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Pemesanan gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[1001] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">Keranjang <span className="text-indigo-600">Belanja</span></h3>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mt-1">{totalItems} Item Terdeteksi</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors uppercase text-xs tracking-wider">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id!)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 mb-2">QNTY / {item.quantity}</p>
                      <p className="font-bold text-indigo-600">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={40} className="text-slate-200" />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">Keranjang Kosong</h4>
                  <p className="text-xs text-slate-400 max-w-[200px]">Mulai tambahkan koleksi instrumen pilihan Anda di sini.</p>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-slate-100 bg-slate-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Estimasi Total</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(totalPrice)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>Proses Pesanan <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSheet;
