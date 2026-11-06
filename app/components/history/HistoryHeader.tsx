"use client";

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
  onRefresh: () => void;
}

export default function HistoryHeader({ onRefresh }: Props) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-5 lg:mb-9 md:flex-row md:items-end">
      <div>
        <div className="page-kicker">Sales pipeline</div>
        <h1 className="page-title">Riwayat Simulasi</h1>
        <p className="page-subtitle">
          Kelola status prospek dan pantau performa penjualan Anda.
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={onRefresh} 
          className="flex min-h-11 items-center gap-2 rounded-xl rounded-tr-sm border border-slate-300 bg-[#FFFEFB] px-4 py-2 text-xs font-extrabold text-slate-700 shadow-[0_10px_24px_-20px_rgba(8,27,46,0.8)] transition-colors hover:border-cyan-300 hover:bg-cyan-50/60 active:translate-y-px"
        >
            <RefreshCw className="w-4 h-4"/>
            <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
