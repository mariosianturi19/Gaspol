// app/simulation/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Search } from 'lucide-react';
import { useCreditSimulation } from '../../hooks/useCreditSimulation';
import SimulationInputs from '../../components/simulation/SimulationInputs';
import SimulationResult from '../../components/simulation/SimulationResult';
import Modal from '../../components/ui/Modal';

export default function CreditSimulationPage() {
  const router = useRouter();
  const {
    form, setForm,
    result,
    isLoading, errorMsg, isSaving,
    saveSuccess, setSaveSuccess,
    validationError, setValidationError,
    isDemoMode,
    availableTenors, availableInsuranceOptions,
    handleChange, handleSave, solveBudget, 
    handleFileChange, removeAttachment 
  } = useCreditSimulation();

  if (isLoading) return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-slate-600">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl rounded-tr-sm border border-slate-200 bg-white shadow-sm">
        <Loader2 className="h-7 w-7 animate-spin text-[#005FAF]"/>
      </div>
      <p className="text-xs font-extrabold uppercase tracking-[0.14em]">Memuat Database...</p>
    </div>
  );
  
  if (errorMsg) return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center text-red-600">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl rounded-tr-sm border border-red-200 bg-red-50">
        <AlertCircle className="h-7 w-7"/>
      </div>
      <p className="text-lg font-extrabold text-slate-900">Terjadi Kesalahan</p>
      <p className="mt-2 max-w-md text-sm text-slate-600">{errorMsg}</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 text-slate-800 lg:pb-10">
      
      <div className="gaspol-shell flex flex-col gap-6 pb-7 pt-9 sm:flex-row sm:items-end sm:justify-between lg:pb-9 lg:pt-12">
          <div>
            <div className="page-kicker">Credit workspace</div>
            <h1 className="page-title">Simulasi Kredit</h1>
            <p className="page-subtitle">Susun skenario pembiayaan dan lihat struktur angsuran secara presisi.</p>
          </div>

          {/* Mode Switcher - Desktop & Mobile Optimized */}
          <div className="precision-segmented flex w-full sm:w-auto">
             <button 
                onClick={() => setForm(f => ({...f, mode: 'NORMAL'}))} 
                className={`flex-1 rounded-lg rounded-tr-sm px-5 py-2.5 text-xs font-extrabold transition-colors sm:flex-none ${form.mode === 'NORMAL' ? 'bg-[#081B2E] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
             >
                Normal
             </button>
             <button 
                onClick={() => setForm(f => ({...f, mode: 'BUDGET'}))} 
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg rounded-tr-sm px-5 py-2.5 text-xs font-extrabold transition-colors sm:flex-none ${form.mode === 'BUDGET' ? 'bg-[#005FAF] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
             >
                <Search className="w-3 h-3"/> Budget
             </button>
          </div>
      </div>

      <div className="gaspol-shell">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          
          {/* KOLOM KIRI: INPUT */}
          <div className="space-y-5 lg:col-span-5">
            <SimulationInputs 
              form={form} 
              setForm={setForm}
              handleChange={handleChange}
              availableTenors={availableTenors}
              availableInsuranceOptions={availableInsuranceOptions}
              solveBudget={solveBudget}
              handleFileChange={handleFileChange}
              removeAttachment={removeAttachment}
            />
          </div>

          {/* KOLOM KANAN: HASIL */}
          <div className="lg:col-span-7">
            <div className="sticky top-[7rem]">
              <SimulationResult 
                result={result}
                form={form}
                handleSave={handleSave}
                isSaving={isSaving}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={!!validationError} 
        onClose={() => setValidationError(null)} 
        title="Validasi Gagal" 
        type="error"
      >
        <p>{validationError}</p>
      </Modal>

      <Modal 
        isOpen={saveSuccess} 
        onClose={() => {
            setSaveSuccess(false);
            if (!isDemoMode) router.push('/pages/history');
        }} 
        title="Berhasil Disimpan"
        type="success"
      >
        <p>
          {isDemoMode
            ? 'Simulasi kredit berhasil diproses.'
            : 'Simulasi kredit berhasil disimpan ke dalam riwayat.'}
        </p>
      </Modal>
    </div>
  );
}
