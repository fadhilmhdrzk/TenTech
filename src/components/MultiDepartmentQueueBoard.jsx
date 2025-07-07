import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Sesuaikan path jika perlu
import NowServingDisplay from './NowServingDisplay'; // Impor komponen NowServingDisplay

export default function MultiDepartmentQueueBoard() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil daftar departemen aktif saat komponen dimuat
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('id, name')
          .eq('is_active', true) // Hanya departemen yang aktif
          .order('name', { ascending: true }); // Urutkan berdasarkan nama

        if (error) {
          throw error;
        }
        setDepartments(data);
      } catch (err) {
        console.error("Error fetching departments for board:", err.message);
        setError("Gagal memuat daftar departemen untuk papan antrean.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
        <p className="mt-2 text-lg text-gray-700">Memuat papan antrean...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada departemen aktif yang ditemukan untuk ditampilkan di papan antrean.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map(dept => (
        <NowServingDisplay 
          key={dept.id} 
          departmentId={dept.id} 
          departmentName={dept.name} 
        />
      ))}
    </div>
  );
}