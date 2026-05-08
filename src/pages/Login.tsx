import { useState } from 'react';
import React from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../App';
import { LogIn, ArrowLeft, Key, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (loading) return null;
  if (user) return <Navigate to="/admin" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Admin authenticated successfully');
      navigate('/admin');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-zinc-950 font-sans">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} /> Back to Portfolio
      </button>

      <div className="w-full max-w-md p-10 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-600/20">
          <LogIn size={32} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 tracking-tighter">Admin Terminal</h1>
        <p className="text-zinc-500 mb-10 text-sm">Access the PulseDesign CMS. Ensure Email Auth is enabled in Firebase Console.</p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Admin Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@pulsedesign.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Security Key</label>
            <div className="relative">
              <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all text-sm font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-4 mt-4 rounded-xl font-bold flex items-center justify-center gap-3 bg-white text-zinc-950 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoggingIn ? 'Decrypting Access...' : 'Authenticate'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-800 flex items-center justify-center gap-8">
           <div className="flex flex-col items-center">
              <span className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Status</span>
              <span className="text-[10px] text-green-500 font-mono">ENCRYPTED</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Server</span>
              <span className="text-[10px] text-zinc-400 font-mono">RTDB-MAIN</span>
           </div>
        </div>
      </div>
    </div>
  );
}
