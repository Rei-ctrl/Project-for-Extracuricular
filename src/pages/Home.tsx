import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { PenTool, FileText, Layout, Palette, Box, ArrowRight, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';

const categories = [
  { name: 'Writing', icon: PenTool, color: 'bg-orange-50 text-orange-600' },
  { name: 'Paper', icon: FileText, color: 'bg-blue-50 text-blue-600' },
  { name: 'Desktop', icon: Layout, color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Art', icon: Palette, color: 'bg-purple-50 text-purple-600' },
  { name: 'Organization', icon: Box, color: 'bg-slate-50 text-slate-600' },
];

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useUI();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col md:flex-row items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-light text-slate-800 tracking-tight leading-none mb-4">
                Premium <span className="font-bold text-black">Stationery</span>
              </h1>
              <p className="text-slate-500 text-xl font-medium max-w-xl leading-relaxed">
                Penyedia instrumen tulis presisi yang dirancang untuk mendukung identitas profesional dan kreativitas tanpa batas.
              </p>
            </motion.div>
            <div className="flex bg-slate-100 border border-slate-200 rounded-2xl p-1 shadow-sm">
              <button className="px-6 py-2 bg-white rounded-xl text-xs font-bold shadow-sm">Katalog</button>
              <button className="px-6 py-2 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">Toko</button>
            </div>
          </header>
        </div>
      </section>

      {/* Categories Grid - Refined */}
      <section id="categories" className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group cursor-pointer"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", cat.color)}>
                  <cat.icon size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                <div className="w-8 h-1 bg-indigo-100 rounded-full mt-2 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product List - Geometric style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex items-end justify-between border-b border-slate-100 pb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {searchQuery ? `Hasil untuk "${searchQuery}"` : 'Koleksi Terlaris'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {searchQuery 
                  ? `Ditemukan ${filteredProducts.length} instrumen yang cocok` 
                  : 'Peralatan pilihan profesional bulan ini'}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Instrumen Terkurasi</span>
              <span className="text-xl font-black text-indigo-600 tabular-nums">
                {String(filteredProducts.length).padStart(3, '0')}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-slate-100 border border-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Instrumen tidak ditemukan</h3>
              <p className="text-slate-500 text-sm mt-2">Coba gunakan kata kunci lain untuk hasil yang berbeda.</p>
            </div>
          )}

          <footer className="bg-indigo-900 border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between mt-20 text-white shadow-xl shadow-indigo-900/10">
            <div className="flex flex-col mb-4 md:mb-0">
               <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2 font-mono tracking-widest">Layanan Premium</span>
               <h3 className="text-2xl font-serif italic">Build your corporate identity with professional tools.</h3>
            </div>
            <button className="px-8 py-3 bg-white text-indigo-900 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all border border-white/20">
              White-label Service
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default Home;
