"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import { User, Eye, Loader2, Trash2, Calendar, Car, ChevronDown, Check } from 'lucide-react';
import { HistoryItem } from '@/app/types/history';
import { UserSession } from '@/app/hooks/useAuth';

interface Props {
  data: HistoryItem[];
  isLoading: boolean;
  updatingId: number | null;
  handleStatusChange: (id: number, status: string) => void;
  handleDelete?: (id: number) => void;
  setSelectedItem: (item: HistoryItem) => void;
  currentUser: UserSession | null;
}

const toIDR = (num: number | null | undefined) => {
  if (num == null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const formatDate = (str: string) => new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const getStatusColor = (status: string) => {
  switch (status) {
    case 'DONE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'TODO': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'PROGRES': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'REJECT': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};

export default function HistoryTable({ 
  data, isLoading, updatingId, handleStatusChange, handleDelete, setSelectedItem, currentUser 
}: Props) {
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600"/>
        <p className="text-slate-400 text-sm animate-pulse">Memuat data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Belum ada data</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
          Mulai buat simulasi baru untuk melihat riwayat perhitungan Anda di sini.
        </p>
      </div>
    );
  }

  const isProsesor = currentUser?.role === 'PROSESOR';

  return (
    <>
      {/* Desktop View (Table) */}
      <div className="data-table-shell hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-white/10 text-[10px] font-extrabold uppercase tracking-[0.13em]">
              <tr>
                <th className="px-6 py-4 text-center w-24">Aksi</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Nasabah</th>
                <th className="px-6 py-4">Unit Kendaraan</th>
                <th className="px-6 py-4 text-right">Harga OTR</th>
                <th className="px-6 py-4 text-right">Angsuran</th>
                <th className="px-6 py-4 text-center w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <tr key={item.id} className="group transition-colors">
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {isProsesor ? (
                        <button 
                            onClick={() => setSelectedItem(item)}
                            className="rounded-lg rounded-tr-sm border border-slate-200 bg-white p-2 text-[#005FAF] transition-colors hover:border-cyan-300 hover:bg-cyan-50"
                            title="Lihat Rincian"
                        >
                            <Eye className="w-4 h-4"/>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">View</span>
                      )}

                      {isProsesor && handleDelete && (
                        <button 
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg rounded-tr-sm border border-slate-200 bg-white p-2 text-red-600 transition-colors hover:border-red-200 hover:bg-red-50"
                            title="Hapus Data"
                        >
                            <Trash2 className="w-4 h-4"/>
                        </button>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {formatDate(item.createdAt)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{item.borrowerName}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg rounded-tr-sm bg-cyan-50 p-1.5">
                        <Car className="h-4 w-4 text-[#005FAF]" />
                      </div>
                      <span className="text-slate-700 font-medium">{item.unitName}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-slate-600">
                    {toIDR(item.vehiclePrice)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-slate-900">{toIDR(item.monthlyPayment)}</div>
                    <div className="text-xs text-slate-500">{item.tenor} Bulan</div>
                  </td>

                  <td className="px-6 py-4 text-center relative">
                    {isProsesor ? (
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (openDropdownId === item.id) {
                              setOpenDropdownId(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setDropdownPosition({
                                top: rect.bottom + 8,
                                left: rect.right - 144
                              });
                              setOpenDropdownId(item.id);
                            }
                          }}
                          disabled={updatingId === item.id}
                          className={`status-badge flex items-center gap-2 border px-4 py-1.5 transition-colors ${getStatusColor(item.status)} hover:brightness-95 active:translate-y-px`}
                        >
                          {updatingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              {item.status}
                              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdownId === item.id ? 'rotate-180' : ''}`} />
                            </>
                          )}
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdownId === item.id && createPortal(
                          <>
                            <div 
                              className="fixed inset-0 z-[9998] cursor-default" 
                              onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }}
                            />
                            <div 
                              className="fixed z-[9999] w-36 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right"
                              style={{ 
                                top: `${dropdownPosition.top}px`, 
                                left: `${dropdownPosition.left}px` 
                              }}
                            >
                              <div className="p-1 space-y-0.5">
                                {['TODO', 'DONE', 'REJECT'].map((status) => (
                                  <button
                                    key={status}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(item.id, status);
                                      setOpenDropdownId(null);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
                                      item.status === status 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                  >
                                    {status}
                                    {item.status === status && <Check className="w-3 h-3" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>,
                          document.body
                        )}
                      </div>
                    ) : (
                      <span className={`status-badge border px-3 py-1.5 ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="md:hidden space-y-4 pb-20">
        {data.map((item) => (
          <div 
            key={item.id} 
            className="precision-card p-5 active:translate-y-px"
            onClick={() => isProsesor && setSelectedItem(item)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl rounded-tr-sm bg-cyan-50 text-sm font-bold text-[#005FAF]">
                  {item.borrowerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{item.borrowerName}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
              
              {isProsesor ? (
                <div onClick={(e) => e.stopPropagation()}>
                   <select 
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      disabled={updatingId === item.id}
                      className={`status-badge appearance-none border px-2 py-1 outline-none ${getStatusColor(item.status)}`}
                    >
                      <option value="TODO">TODO</option>
                      <option value="DONE">DONE</option>
                      <option value="REJECT">REJECT</option>
                    </select>
                </div>
              ) : (
                <span className={`status-badge border px-2 py-1 ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between rounded-xl rounded-tr-sm border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Car className="w-4 h-4" />
                  <span>{item.unitName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl rounded-tr-sm border border-slate-200 p-3">
                  <div className="text-xs text-slate-400 mb-1">Harga OTR</div>
                  <div className="font-semibold text-slate-700 text-sm">{toIDR(item.vehiclePrice)}</div>
                </div>
                <div className="rounded-xl rounded-tr-sm border border-cyan-200 bg-cyan-50/60 p-3">
                  <div className="mb-1 text-xs text-[#3C91A7]">Angsuran</div>
                  <div className="financial-value text-base font-bold text-[#0A4E72]">{toIDR(item.monthlyPayment)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              {isProsesor ? (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl rounded-tr-sm bg-[#081B2E] py-2.5 text-sm font-bold text-white active:bg-[#0A3156]"
                  >
                    <Eye className="w-4 h-4" />
                    Rincian
                  </button>
                  {handleDelete && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="p-2.5 text-red-500 bg-red-50 rounded-xl active:bg-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </>
              ) : (
                <button className="w-full py-2 text-center text-xs text-slate-400 italic bg-slate-50 rounded-lg">
                  View Only Mode
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
