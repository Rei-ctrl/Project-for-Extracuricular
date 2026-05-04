import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw, Share2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-8">
        <ShoppingCart size={40} />
      </div>
      <h2 className="text-3xl font-light tracking-tight mb-4 text-slate-800">Instrumen tidak <span className="font-bold text-black">Ditemukan</span></h2>
      <button 
        onClick={() => navigate('/')} 
        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
      >
        Kembali ke Katalog
      </button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-24 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-400 hover:text-indigo-600 transition-colors mb-12 text-[10px] font-bold uppercase tracking-widest font-mono"
        >
          <ArrowLeft size={16} className="mr-2" /> Kembali ke Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Image Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-12 xl:col-span-7"
          >
            <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm relative group">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-indigo-700 border border-white shadow-sm">
                Authentic Series
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-12 xl:col-span-5 flex flex-col justify-center"
          >
            <div className="mb-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 font-mono mb-4 block">
                Catalog / {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <p className="text-3xl font-black text-indigo-600">
                  {formatCurrency(product.price)}
                </p>
                <div className="h-6 w-px bg-slate-200" />
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  product.stockStatus === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {product.stockStatus === 'available' ? 'Tersedia' : 'Habis Stok'}
                </span>
              </div>
            </div>

            <div className="mb-12 border-l-4 border-indigo-100 pl-6">
              <p className="text-slate-600 leading-relaxed text-xl font-serif italic">
                "{product.description}"
              </p>
            </div>

            <div className="space-y-10">
              {/* Quantity Selector */}
              <div className="flex items-center gap-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Kuantitas</span>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1 shadow-inner">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stockStatus === 'out-of-stock' || isAdded}
                  className={`flex-grow flex items-center justify-center space-x-3 py-6 transition-all rounded-2xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 shadow-xl ${
                    isAdded ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                  }`}
                >
                  {isAdded ? <CheckCircle2 size={20} /> : <ShoppingCart size={20} />}
                  <span>{isAdded ? 'Berhasil Ditambahkan' : 'Tambahkan ke Koleksi'}</span>
                </button>
                <button className="p-6 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm group">
                  <Share2 size={24} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-100">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <Truck size={18} className="text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-tight text-slate-500">Logistik <br /> Prioritas</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <ShieldCheck size={18} className="text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-tight text-slate-500">Verifikasi <br /> Kurasi</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <RotateCcw size={18} className="text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-tight text-slate-500">Jaminan <br /> Kepuasan</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
