// app/history/page.tsx
"use client";

import React, { useState } from 'react';
import { useHistory } from '../../hooks/useHistory';
import { useAuth } from '../../hooks/useAuth';
import HistoryHeader from '../../components/history/HistoryHeader';
import HistoryTable from '../../components/history/HistoryTable';
import HistoryDetailModal from '../../components/history/HistoryDetailModal';
import DeleteConfirmationModal from '../../components/ui/DeleteConfirmationModal';

export default function HistoryPage() {
  const { user } = useAuth(); // Ambil data user login
  
  const { 
    data, 
    isLoading, 
    updatingId, 
    selectedItem, 
    setSelectedItem, 
    fetchData, 
    handleStatusChange 
  } = useHistory();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fungsi Hapus (Hanya akan berhasil jika user PROSESOR)
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/simulation/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        await fetchData();
        setDeleteId(null);
      } else {
        const json = await res.json();
        alert(json.error || "Gagal menghapus data.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="gaspol-shell min-h-[calc(100vh-5.5rem)] pb-10 pt-9 lg:pt-12">
      <HistoryHeader onRefresh={fetchData} />

      <HistoryTable 
        data={data}
        isLoading={isLoading}
        updatingId={updatingId}
        handleStatusChange={handleStatusChange}
        handleDelete={handleDeleteClick}
        setSelectedItem={setSelectedItem}
        currentUser={user} // Pass data user
      />

      <HistoryDetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => !isDeleting && setDeleteId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
