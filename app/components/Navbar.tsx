// app/components/Navbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, History, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Jangan tampilkan navbar di halaman login
  if (pathname === '/pages/login') {
    return null;
  }

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <>
      {/* Desktop Navbar (Hidden on Mobile) */}
      <nav className="fixed inset-x-0 top-0 z-50 hidden border-b border-white/10 bg-[#071A2E]/[0.97] shadow-[0_14px_40px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl md:block">
        <div className="mx-auto max-w-[90rem] px-8">
          <div className="flex h-[5.5rem] items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3.5">
              <div className="relative flex items-center justify-center rounded-xl rounded-tr-sm border border-white/70 bg-[#FFFEFB] p-1 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.9)]">
                <img 
                  src="/GASPOL.png?v=3" 
                  alt="Gaspol Logo" 
                  className="relative z-10 h-14 w-14 object-contain"
                />
              </div>
              <div className="relative z-10 leading-none">
                <span className="block text-xl font-extrabold tracking-[-0.04em] text-white">GASPOL</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-200/70">Credit Performance Console</span>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="flex items-center gap-7">
              <div className="flex items-center gap-1 rounded-xl rounded-tr-sm border border-white/10 bg-white/[0.055] p-1">
                <Link 
                  href="/pages/simulation" 
                  className={`relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold tracking-wide transition-colors ${
                    isActive('/pages/simulation') 
                      ? 'bg-white text-[#081B2E] shadow-[0_8px_22px_-14px_rgba(0,0,0,0.8)]'
                      : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  Simulasi
                </Link>
                <Link 
                  href="/pages/history" 
                  className={`relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold tracking-wide transition-colors ${
                    isActive('/pages/history') 
                      ? 'bg-white text-[#081B2E] shadow-[0_8px_22px_-14px_rgba(0,0,0,0.8)]'
                      : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </Link>
              </div>

              {/* User Profile */}
              {user && (
                <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                  <div className="text-right">
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-cyan-300/80">{user.role}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-100">{user.name}</div>
                  </div>
                  <button 
                    onClick={logout}
                    className="group rounded-xl rounded-tr-sm border border-white/10 bg-white/[0.055] p-2.5 transition-colors hover:border-red-400/40 hover:bg-red-500/10"
                    title="Keluar"
                  >
                    <LogOut className="h-4 w-4 text-slate-300 transition-colors group-hover:text-red-300" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar (Logo Only) */}
      <nav className="fixed inset-x-0 top-0 z-50 flex h-[4.5rem] items-center justify-between border-b border-white/10 bg-[#071A2E]/[0.98] px-4 shadow-[0_12px_35px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center rounded-lg rounded-tr-sm border border-white/60 bg-[#FFFEFB] p-0.5 shadow-md">
             <img 
              src="/GASPOL.png?v=3" 
              alt="Gaspol Logo" 
              className="relative z-10 h-10 w-10 object-contain"
            />
          </div>
          <div className="relative z-10 leading-none">
            <span className="block text-base font-extrabold tracking-[-0.035em] text-white">GASPOL</span>
            <span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.17em] text-cyan-200/70">Credit Console</span>
          </div>
        </div>
        {user && (
           <div className="flex items-center gap-2">
             <div className="flex h-9 w-9 items-center justify-center rounded-xl rounded-tr-sm border border-white/10 bg-white/[0.07]">
                <span className="text-xs font-bold text-cyan-200">{user.name.charAt(0)}</span>
             </div>
           </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-[#FFFEFB]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-14px_36px_-26px_rgba(8,27,46,0.5)] backdrop-blur-xl md:hidden">
        <div className="flex h-[4.25rem] items-center justify-around px-2">
          <Link 
            href="/pages/simulation" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive('/pages/simulation') ? 'text-[#005FAF]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className={`rounded-lg rounded-tr-sm p-1.5 transition-colors ${isActive('/pages/simulation') ? 'bg-cyan-50' : ''}`}>
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Simulasi</span>
          </Link>

          <Link 
            href="/pages/history" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive('/pages/history') ? 'text-[#005FAF]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className={`rounded-lg rounded-tr-sm p-1.5 transition-colors ${isActive('/pages/history') ? 'bg-cyan-50' : ''}`}>
              <History className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">History</span>
          </Link>

          <button 
            onClick={logout}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 hover:text-red-500"
          >
            <div className="p-1.5 rounded-xl hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Keluar</span>
          </button>
        </div>
      </nav>
      
      {/* Spacer to prevent content from being hidden behind fixed navbars */}
      <div className="h-[4.5rem] md:h-[5.5rem]"></div>
    </>
  );
}
