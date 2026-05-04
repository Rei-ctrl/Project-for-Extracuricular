import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, Github, ArrowRight, Loader2 } from 'lucide-react';
import { signInWithGoogle, loginWithEmail, registerWithEmail } from '../lib/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getFriendlyErrorMessage = (err: any) => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/popup-closed-by-user':
        return 'Login dibatalkan. Silakan coba lagi jika ingin masuk.';
      case 'auth/invalid-email':
        return 'Format email tidak valid. Gunakan format (contoh@email.com).';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email atau kata sandi salah.';
      case 'auth/missing-password':
        return 'Kata sandi tidak boleh kosong untuk metode ini.';
      case 'auth/email-already-in-use':
        return 'Email sudah terdaftar. Silakan masuk.';
      case 'auth/weak-password':
        return 'Kata sandi minimal 6 karakter.';
      default:
        return err.message || 'Terjadi kesalahan sistem.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Mohon isi email dan kata sandi.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(getFriendlyErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[2001] overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LogIn className="text-indigo-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {isRegistering ? 'Daftar Akun' : 'Selamat Datang Kembali'}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  {isRegistering 
                    ? 'Buat akun baru untuk mulai mengoleksi' 
                    : 'Masuk untuk mengakses koleksi instrumen Anda'}
                </p>
              </div>

              {!isRegistering && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all text-sm font-bold shadow-xl shadow-indigo-100"
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5 brightness-0 invert" alt="Google" />
                    Lanjutkan dengan Google
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-tighter">
                    Metode Paling Cepat & Aman
                  </p>
                </div>
              )}

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-grow bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">
                  Atau Gunakan Email
                </span>
                <div className="h-px flex-grow bg-slate-100"></div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl flex items-start gap-3">
                  <span className="font-bold shrink-0">Penting:</span> 
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="Alamat Email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/10 focus:bg-white transition-all text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    placeholder="Kata Sandi"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/10 focus:bg-white transition-all text-sm font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {!isRegistering && (
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-600 hover:underline">
                      Lupa?
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      {isRegistering ? 'Daftar Manual' : 'Masuk Manual'} <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {isRegistering && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                    Daftar dengan Google
                  </button>
                </div>
              )}

              <div className="mt-8 text-center text-sm text-slate-500">
                {isRegistering ? (
                  <>Sudah punya akun? <button onClick={() => setIsRegistering(false)} className="text-indigo-600 font-bold hover:underline">Masuk</button></>
                ) : (
                  <>Belum punya akun? <button onClick={() => setIsRegistering(true)} className="text-indigo-600 font-bold hover:underline">Daftar</button></>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
