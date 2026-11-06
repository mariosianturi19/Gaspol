"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Sembunyikan footer di halaman login
  if (pathname === '/pages/login') {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-slate-300/60 bg-[#F3F1EB]/90 py-6">
      <div className="gaspol-shell flex items-center justify-between gap-4">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
          GASPOL / Credit Performance Console
        </div>
        <div className="text-right text-[11px] text-slate-500">
          &copy; {new Date().getFullYear()} Setir Kanan
        </div>
      </div>
    </footer>
  );
}
