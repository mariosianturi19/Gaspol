// app/login/page.tsx
"use client";

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login gagal');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-shell flex w-full flex-col lg:flex-row">
      {/* Brand Section - Top on Mobile, Left on Desktop */}
      <div className="login-brand-panel flex shrink-0 flex-col justify-center px-6 py-9 text-white lg:w-[52%] lg:px-[clamp(3rem,7vw,8rem)] lg:py-16">
        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-start">
          <div className="login-eyebrow mb-7 flex items-center gap-3 lg:mb-12">
            <span className="h-px w-8 bg-cyan-300" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-cyan-100/80">Sales Credit Workspace</span>
          </div>

          <div className="flex w-full flex-col items-center lg:items-start">
            <div className="login-logo-stage relative mb-6 flex h-44 w-44 items-center justify-center p-5 lg:mb-10 lg:h-72 lg:w-72 lg:p-8">
             <img 
              src="/GASPOL.png?v=3" 
              alt="Gaspol Logo" 
              className="relative z-10 h-full w-full object-contain"
            />
            </div>

            <div className="max-w-lg text-center lg:text-left">
              <h1 className="text-3xl font-extrabold leading-[1.04] tracking-[-0.045em] text-white lg:text-5xl">
                Precision at every<br className="hidden lg:block" /> credit decision.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 lg:mt-5 lg:text-base">
                Growth Accelerator System for Performance Optimization &amp; Leads
              </p>
            </div>
          </div>

          <div className="login-partner mt-8 flex items-center gap-4 border-t border-white/10 pt-6 lg:mt-12 lg:pt-8">
            <p className="text-[8px] font-bold uppercase leading-relaxed tracking-[0.18em] text-slate-400 lg:text-[9px]">
              Exclusively<br />built for
            </p>
            <div className="rounded-lg rounded-tr-sm bg-white px-3 py-2 shadow-[0_12px_30px_-22px_rgba(0,0,0,0.9)]">
               <img 
                 src="/setir-kanan.png" 
                 alt="Setir Kanan" 
                 className="h-7 w-auto object-contain lg:h-9"
               />
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="login-form-panel flex flex-1 flex-col items-center justify-center px-6 py-10 sm:p-12 lg:p-[clamp(4rem,7vw,8rem)]">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="page-kicker">Secure access</div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.045em] text-[#081B2E] lg:text-4xl">Sign in to GASPOL</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">Enter your registered account to continue to the credit workspace.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl rounded-tr-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-600">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    className="w-full border py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition-colors"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-600">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full border py-3 pl-12 pr-12 text-sm text-slate-900 outline-none transition-colors"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-slate-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>


            
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex min-h-13 w-full items-center justify-center gap-3 rounded-xl rounded-tr-sm bg-[#081B2E] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_18px_40px_-24px_rgba(8,27,46,0.85)] transition-colors hover:bg-[#0A3156] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
