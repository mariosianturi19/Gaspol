// app/components/simulation/SimulationResult.tsx
"use client";

import React from 'react';
import { FileText, Calculator, Save, Loader2, AlertTriangle } from 'lucide-react';
import { CalculationResult, SimulationForm } from '@/app/types/simulation';

interface Props {
  result: CalculationResult | null;
  form: SimulationForm;
  handleSave: () => void;
  isSaving: boolean;
}

const toIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
const toPct = (num: number) => (num * 100).toFixed(3) + '%';

export default function SimulationResult({ result, form, handleSave, isSaving }: Props) {
  return (
    <div className="precision-result flex flex-col">
      
      {/* Header Result */}
      <div className="precision-result-header px-5 py-6 sm:px-7 sm:py-7">
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
              <div className="mb-3 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.2em] text-cyan-200/75">
                <span className="h-px w-6 bg-cyan-300/80" /> Credit calculation
              </div>
              <h3 className="flex items-center gap-2 text-xl font-extrabold tracking-[-0.025em] text-white">
                <FileText className="h-5 w-5 text-cyan-300"/> {form.mode === 'BUDGET' ? 'Hasil Simulasi Budget' : 'Hasil Simulasi Kredit'}
              </h3>
              {form.mode === 'BUDGET' && result ? (
                  <p className="mt-2 inline-block rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-xs font-medium text-cyan-100">
                      Rekomendasi DP: <b>{toIDR(result.dpAmount)} ({result.dpPercentCalc.toFixed(2)}%)</b>
                  </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-300">Rincian perhitungan kredit kendaraan</p>
              )}
          </div>
          {result && (
              <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${result.isSpecialScenario ? 'border-amber-300/30 bg-amber-300/15 text-amber-100' : 'border-white/15 bg-white/10 text-slate-100'}`}>
                      {result.isSpecialScenario && <AlertTriangle className="w-3 h-3"/>}
                      STAR {result.starLevel}
                  </div>
              </div>
          )}
        </div>

        {result && (
          <div className="relative z-10 mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl rounded-tr-sm border border-white/10 bg-white/10">
            <div className="bg-[#071A2E]/60 p-4 sm:p-5">
              <div className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Angsuran / bulan</div>
              <div className="financial-value mt-1 text-2xl font-bold text-white sm:text-3xl">{toIDR(result.monthlyInstallment)}</div>
            </div>
            <div className="bg-[#071A2E]/60 p-4 sm:p-5">
              <div className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Total bayar awal</div>
              <div className="financial-value mt-1 text-2xl font-bold text-cyan-200 sm:text-3xl">{toIDR(result.totalDownPayment)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Content Result */}
      {!result ? (
        <div className="flex min-h-[380px] flex-col items-center justify-center p-10 text-slate-300">
            <div className="mb-6 grid h-20 w-20 place-items-center rounded-2xl rounded-tr-sm border border-slate-200 bg-slate-50">
              <Calculator className="h-8 w-8 text-slate-300"/>
            </div>
            <p className="max-w-xs text-center text-sm font-medium leading-relaxed text-slate-500">
              {form.mode === 'BUDGET' ? 'Masukkan target budget Anda dan tekan tombol hitung' : 'Masukkan Harga OTR dan parameter lainnya untuk melihat hasil'}
            </p>
        </div>
      ) : (
        <div className="flex flex-col">
          
          {/* Detail Table */}
          <div className="p-4 sm:p-6">
            <div className="overflow-hidden border border-slate-200">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3 px-4 text-slate-700 font-bold">Harga Kendaraan</td>
                    <td className="py-3 px-4 font-bold text-right text-slate-800">{toIDR(result.vehiclePrice)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-500">Uang Muka ({result.dpPercentCalc.toFixed(2)}%)</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">{toIDR(result.dpAmount)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-700">Pokok Hutang Murni</td>
                    <td className="py-3 px-4 text-right text-slate-800">{toIDR(result.principalPure)}</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-500">
                        <div className="flex flex-col">
                          <span>Premi Asuransi ({toPct(result.insuranceRatePct)})</span>
                          <span className="text-[10px] text-blue-600 font-bold uppercase mt-0.5">{form.selectedInsuranceLabel}</span>
                        </div>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">{toIDR(result.insuranceAmount)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-500">+ Biaya Polis (AR)</td>
                    <td className="py-3 px-4 text-right text-slate-600">{toIDR(result.policyFee)}</td>
                  </tr>

                  {/* Total AR Row - Blue Highlight */}
                  <tr className="border-t-2 border-cyan-100 bg-cyan-50/50">
                    <td className="py-3 px-4 text-slate-700">Total AR (Awal)</td>
                    <td className="py-3 px-4 text-right text-slate-800">{toIDR(result.totalAR)}</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-500">Bunga Flat ({toPct(result.interestRatePct)}/thn)</td>
                    <td className="py-3 px-4 text-right text-slate-600">x {form.paymentType === 'ADDM' ? form.tenor - 1 : form.tenor} Bulan</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-500">Total Bunga</td>
                    <td className="py-3 px-4 text-right text-slate-600">{toIDR(result.totalInterest)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-700">Jumlah Hutang</td>
                    <td className="py-3 px-4 text-right text-slate-800">{toIDR(result.totalLoan)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-500 italic">Nilai AP (Price - TDP)</td>
                    <td className="py-3 px-4 text-right text-slate-500 italic">{toIDR(result.nilaiAP)}</td>
                  </tr>

                  {/* Angsuran Highlight */}
                  <tr className="border-y-2 border-amber-100 bg-amber-50/70">
                    <td className="px-3 py-3 text-sm font-bold text-slate-800 lg:px-4 lg:py-4 lg:text-lg">Angsuran per Bulan</td>
                    <td className="financial-value px-3 py-3 text-right text-lg font-bold text-[#A65D18] lg:px-4 lg:py-4 lg:text-2xl">{toIDR(result.monthlyInstallment)}</td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* TDP Section - Separated */}
            <div className="mt-7 overflow-hidden border border-slate-200">
                <div className="bg-[#081B2E] px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-100">
                    RINCIAN PEMBAYARAN PERTAMA (TDP)
                </div>
                <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-200">
                        <tr>
                            <td className="py-3 px-4 text-slate-500">Uang Muka (DP)</td>
                            <td className="py-3 px-4 text-right font-medium text-slate-700">{toIDR(result.dpAmount)}</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-slate-500">Biaya Admin</td>
                            <td className="py-3 px-4 text-right font-medium text-slate-700">{toIDR(result.adminFee)}</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-slate-500">Biaya Polis (TDP)</td>
                            <td className="py-3 px-4 text-right font-medium text-slate-700">{toIDR(result.policyFeeTDP)}</td>
                        </tr>
                        {form.paymentType === 'ADDM' && (
                            <tr>
                                <td className="py-3 px-4 text-slate-500">Angsuran Pertama (ADDM)</td>
                                <td className="py-3 px-4 text-right font-medium text-slate-700">{toIDR(result.firstInstallment)}</td>
                            </tr>
                        )}
                        <tr className="bg-emerald-50">
                            <td className="px-4 py-4 font-bold text-emerald-800">TOTAL BAYAR (TDP)</td>
                            <td className="financial-value px-4 py-4 text-right text-xl font-bold text-emerald-800">{toIDR(result.totalDownPayment)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

          </div>

          {/* Action Footer */}
          <div className="flex justify-end border-t border-slate-200 bg-[#F5F6F4] p-4">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-xl rounded-tr-sm bg-[#081B2E] px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_32px_-22px_rgba(8,27,46,0.9)] transition-colors hover:bg-[#0A3156] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSaving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4"/>}
              {isSaving ? 'Menyimpan...' : 'Simpan Simulasi'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
