import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, serverTimestamp, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Plus, Edit2, Trash2, Save, X, Package, DollarSign, Image as ImageIcon, Tag, FileText, CheckCircle2, AlertCircle, Wand2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateProductDescription } from '../services/copywriting';

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleGenerateDescription = async () => {
    if (!currentProduct?.name) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(currentProduct.name, currentProduct.category || 'Writing');
    setCurrentProduct({ ...currentProduct, description: desc });
    setIsGenerating(false);
  };

  const handleSeedData = async () => {
    if (!window.confirm('Ingin mengisi toko dengan data contoh profesional?')) return;
    
    const seeds = [
      {
        name: 'Montblanc Meisterstück Fountain Pen',
        description: 'Ikon desain yang melampaui waktu. Dibuat dengan presisi Jerman, pena ini menawarkan pengalaman menulis yang tak tertandingi dengan nib emas 14K hand-crafted.',
        price: 12500000,
        imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000&auto=format&fit=crop',
        category: 'Writing',
        stockStatus: 'available',
        createdAt: serverTimestamp()
      },
      {
        name: 'Rhodia Webnotebook A5 - Black',
        description: 'Kertas premium Clairefontaine 90g yang halus seperti sutra. Pilihan utama para profesional untuk pencatatan ide tanpa takut tembus tinta.',
        price: 350000,
        imageUrl: 'https://images.unsplash.com/photo-1544816153-12ad5d714300?q=80&w=1000&auto=format&fit=crop',
        category: 'Paper',
        stockStatus: 'available',
        createdAt: serverTimestamp()
      },
      {
        name: 'Delfonics Canvas Utility Case',
        description: 'Organisir meja kerja Anda dengan gaya Jepang yang fungsional. Terbuat dari kanvas katun tahan lama dengan banyak saku fungsional.',
        price: 420000,
        imageUrl: 'https://images.unsplash.com/photo-1510109121783-05994f109250?q=80&w=1000&auto=format&fit=crop',
        category: 'Organization',
        stockStatus: 'available',
        createdAt: serverTimestamp()
      }
    ];

    try {
      for (const item of seeds) {
        await addDoc(collection(db, 'products'), item);
      }
      alert('Data berhasil di-seed!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  if (authLoading) return <div className="p-12 text-center text-slate-500 font-mono tracking-widest uppercase text-xs">Menunggu Otentikasi...</div>;
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
         <AlertCircle size={40} />
      </div>
      <h2 className="text-4xl font-light tracking-tight mb-4 text-slate-800">Akses <span className="font-bold text-black">Terbatas</span></h2>
      <p className="text-slate-500 max-w-md mx-auto leading-relaxed">Anda tidak memiliki izin administratif untuk mengakses area manajemen produk ini.</p>
    </div>
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    const path = currentProduct.id ? `products/${currentProduct.id}` : 'products';
    try {
      const productData = {
        ...currentProduct,
        price: Number(currentProduct.price),
        updatedAt: serverTimestamp(),
      };

      if (currentProduct.id) {
        const { id, ...dataToUpdate } = productData;
        await updateDoc(doc(db, 'products', id as string), dataToUpdate);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }
      setIsEditing(false);
      setCurrentProduct(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      }
    }
  };

  const openForm = (product: Product | null = null) => {
    setCurrentProduct(product || {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: 'Writing',
      stockStatus: 'available',
    });
    setIsEditing(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Statistics Sidebar - Like the theme */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 font-mono">Ringkasan Produk</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium">Total Katalog</span>
                <span className="text-sm font-black text-indigo-700">{products.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium">Habis Stok</span>
                <span className="text-sm font-black text-red-500">
                  {products.filter(p => p.stockStatus === 'out-of-stock').length}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2 overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(products.filter(p => p.stockStatus === 'available').length / products.length) * 100}%` }}
                  className="bg-indigo-500 h-full rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Tingkat Ketersediaan</p>
            </div>
          </div>
          
          <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl shadow-indigo-900/20">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4 font-mono">Fitur AI</h3>
            <p className="text-xl font-serif italic mb-6 leading-tight">Optimalkan deskripsi produk dengan kecerdasan buatan.</p>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
              Jelajahi Generator
            </button>
          </div>
        </aside>

        {/* Product Grid Content */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-8">
          <header className="flex flex-col sm:flex-row items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-light text-slate-800 tracking-tight leading-none">
                Manajemen <span className="font-bold text-black">Produk</span>
              </h1>
              <p className="text-slate-500 mt-2">Kontrol inventaris premium TulisHub Anda di sini.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSeedData}
                className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
              >
                <Database size={16} />
                <span className="hidden sm:inline">Isi Data</span>
              </button>
              <button
                onClick={() => openForm()}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Plus size={18} />
                <span>Baru</span>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                layout
                key={product.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:shadow-slate-200 transition-all group"
              >
                <div className="aspect-[4/3] bg-slate-50 rounded-2xl mb-4 overflow-hidden relative">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => openForm(product)}
                      className="p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-sm text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-sm text-slate-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-700 transition-colors">{product.name}</h4>
                  <span className="font-bold text-indigo-600 text-sm">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                    product.stockStatus === 'available' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {product.stockStatus === 'available' ? 'Tersedia' : 'Habis'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono italic">
                    {product.category}
                  </span>
                </div>
              </motion.div>
            ))}
            
            {/* Add New Placeholder/Card like theme */}
            <button
              onClick={() => openForm()}
              className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-400 hover:bg-white transition-all min-h-[300px]"
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Plus size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Tambah Katalog</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-[180px]">Perluas jangkauan alat tulis premium Anda.</p>
              <div className="mt-8 text-xs font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-700 pb-1">
                New Project
              </div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">
                  {currentProduct?.id ? 'Edit Produk' : 'Tambah Produk Baru'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-black">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center mb-1 font-mono">
                      <Package size={14} className="mr-2 text-indigo-500" /> Nama Produk
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                      value={currentProduct?.name || ''}
                      onChange={e => setCurrentProduct({ ...currentProduct!, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center mb-1 font-mono">
                      <Tag size={14} className="mr-2 text-indigo-500" /> Kategori
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                      value={currentProduct?.category || 'Writing'}
                      onChange={e => setCurrentProduct({ ...currentProduct!, category: e.target.value as any })}
                    >
                      <option value="Writing">Writing</option>
                      <option value="Paper">Paper</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Art">Art</option>
                      <option value="Organization">Organization</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center font-mono">
                      <FileText size={14} className="mr-2 text-indigo-500" /> Deskripsi Profesional
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating || !currentProduct?.name}
                      className="flex items-center text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                    >
                      {isGenerating ? 'Menghasilkan...' : (
                        <span className="flex items-center"><Wand2 size={12} className="mr-1" /> AI Copywriter</span>
                      )}
                    </button>
                  </div>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                    value={currentProduct?.description || ''}
                    onChange={e => setCurrentProduct({ ...currentProduct!, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center mb-1 font-mono">
                      <DollarSign size={14} className="mr-2 text-indigo-500" /> Harga (IDR)
                    </label>
                    <input
                      required
                      type="number"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                      value={currentProduct?.price || ''}
                      onChange={e => setCurrentProduct({ ...currentProduct!, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center mb-1 font-mono">
                      <CheckCircle2 size={14} className="mr-2 text-indigo-500" /> Status Stok
                    </label>
                    <div className="flex bg-slate-50 p-1 border border-slate-200 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setCurrentProduct({ ...currentProduct!, stockStatus: 'available' })}
                        className={cn(
                          "flex-grow py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                          currentProduct?.stockStatus === 'available' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-400"
                        )}
                      >
                        Tersedia
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentProduct({ ...currentProduct!, stockStatus: 'out-of-stock' })}
                        className={cn(
                          "flex-grow py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                          currentProduct?.stockStatus === 'out-of-stock' ? "bg-white text-red-600 shadow-sm" : "text-slate-400"
                        )}
                      >
                        Habis
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center mb-1 font-mono">
                    <ImageIcon size={14} className="mr-2 text-indigo-500" /> URL Gambar
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-grow">
                      <input
                        required
                        type="url"
                        placeholder="Tempel link gambar produk di sini..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all"
                        value={currentProduct?.imageUrl || ''}
                        onChange={e => setCurrentProduct({ ...currentProduct!, imageUrl: e.target.value })}
                      />
                    </div>
                    {currentProduct?.imageUrl && (
                      <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                        <img 
                          src={currentProduct.imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Invalid')}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">Tips: Klik kanan gambar di web &gt; Copy Image Address, lalu paste di sini.</p>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="submit"
                    className="flex-grow flex items-center justify-center space-x-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                  >
                    <Save size={18} />
                    <span>Simpan Catalog</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
