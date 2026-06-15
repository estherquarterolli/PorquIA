'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 relative overflow-hidden px-4 py-12 transition-colors duration-300">
      {/* Decorative Mesh Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/20 dark:bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] left-[60%] w-[30%] h-[30%] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-lg glass-panel rounded-[2.5rem] p-8 sm:p-12 relative z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-[0_0_20px_rgba(59,130,246,0.4)] mb-6">
            P
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Welcome Back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-12 pr-12 py-3.5 bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm font-medium pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500/50 dark:bg-zinc-900 cursor-pointer" />
              <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            <span>Sign In</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mt-10">
          Don't have an account? <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold ml-1 transition-colors">Sign up</a>
        </p>
      </div>
    </div>
  );
}
