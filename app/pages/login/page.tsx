// app/login/page.tsx
"use client";

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login gagal');

      // Refresh halaman agar middleware mendeteksi sesi baru
      window.location.href = '/'; 
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row bg-white min-h-screen">
      {/* Brand Section - Top on Mobile, Left on Desktop */}
      {/* UPDATE: padding vertical diubah jadi py-6 (biar lebih ramping dikit di mobile) */}
      <div className="lg:w-[45%] bg-[#00428D] relative overflow-hidden flex flex-col justify-center items-center pt-6 pb-20 px-6 lg:p-16 text-white shrink-0">
        {/* Background Pattern - Minimalist Grid */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>
        
        {/* Gradient Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center w-full">
          <div className="w-48 h-48 lg:w-96 lg:h-96 relative mb-4 lg:mb-6 flex items-center justify-center bg-white rounded-[2rem] p-6 shadow-2xl">
             <img 
              src="/GASPOL.png?v=3" 
              alt="Gaspol Logo" 
              className="w-full h-full object-contain relative z-10"
            />
          </div>
          
          <p className="text-white text-sm lg:text-lg font-medium mb-8 whitespace-normal lg:whitespace-nowrap max-w-[80%] lg:max-w-none leading-relaxed">
            Growth Accelerator System for Performance Optimization & Leads
          </p>

          <div className="flex flex-col items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
            <p className="text-blue-200 text-[10px] lg:text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
              Exclusively Built For
            </p>
            <div className="bg-white rounded-lg px-4 py-2 shadow-lg shadow-blue-900/20">
               <img 
                 src="/setir-kanan.png" 
                 alt="Setir Kanan" 
                 className="h-8 lg:h-12 w-auto object-contain" 
               />
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      {/* UPDATE DI SINI:
          1. pt-8 -> pt-6 (Supaya mepet ke Brand Section)
          2. pb-8 -> pb-4 (Padding bawah dikecilkan sesuai request)
          3. Tetap justify-start (Supaya posisi start dari atas)
      */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center px-6 pt-6 pb-4 sm:p-12 lg:p-24 bg-white">
        {/* UPDATE: space-y-6 -> space-y-8 
           (Memberi jarak lebih antara Header 'Sign in' dan Form, supaya form agak turun dikit mengisi ruang putih)
        */}
        <div className="w-full max-w-sm lg:max-w-md space-y-8 lg:space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-slate-500 mt-2 text-sm lg:text-base">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {error}
            </div>
          )}

          {/* UPDATE: space-y-5 -> space-y-6
             (Memberi jarak lebih antar input & button supaya tombol Sign In turun sedikit lagi ke bawah)
          */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm lg:text-base font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 lg:w-6 lg:h-6 absolute left-3 top-2.5 lg:top-3 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm lg:text-base font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 lg:w-6 lg:h-6 absolute left-3 top-2.5 lg:top-3 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-10 lg:pl-12 pr-12 py-2.5 lg:py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 lg:top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 lg:w-6 lg:h-6" />
                    ) : (
                      <Eye className="w-5 h-5 lg:w-6 lg:h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>


            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 lg:py-3 lg:text-lg rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}