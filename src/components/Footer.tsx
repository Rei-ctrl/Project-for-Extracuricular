import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold tracking-tighter mb-4">TULISHUB</h3>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
              Penyedia alat tulis premium untuk menunjang kreativitas dan produktivitas Anda. 
              Dari kertas berkualitas hingga pena paling halus, kami hadirkan standar profesional ke meja kerja Anda.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Twitter, Mail].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 font-mono">Bantuan</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Cara Pemesanan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pengiriman & Lacak Pesanan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 font-mono">Kontak</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-slate-500" />
                <span>Jakarta Selatan, DKI Jakarta</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-slate-500" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-slate-500" />
                <span>hello@tulishub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; 2026 TulisHub. All rights reserved.</p>
          <p className="mt-2 md:mt-0 italic serif">Built for professionals, by professionals.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
