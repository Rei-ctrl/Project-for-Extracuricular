import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { ShoppingCart, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-slate-200 p-4 group hover:shadow-xl hover:shadow-slate-200 transition-all duration-500 flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] bg-slate-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter text-indigo-600 border border-slate-100">
          {product.stockStatus === 'available' ? 'Tersedia' : 'Habis'}
        </div>
      </Link>

      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate pr-2">
          {product.name}
        </h4>
        <span className="font-bold text-indigo-600 text-sm whitespace-nowrap">
          {formatCurrency(product.price)}
        </span>
      </div>
      
      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-4 h-8">
        {product.description}
      </p>

      <Link 
        to={`/product/${product.id}`}
        className={`w-full py-2.5 text-center transition-all rounded-lg text-xs font-bold uppercase tracking-wider ${
          product.stockStatus === 'available' 
            ? 'bg-slate-900 hover:bg-indigo-700 text-white' 
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
        }`}
      >
        {product.stockStatus === 'available' ? 'Lihat Detail' : 'Stok Kosong'}
      </Link>
    </motion.div>
  );
};

export default ProductCard;
