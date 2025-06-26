import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSessionAndProfiles = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError.message);
        setUser(null);
      } else if (session?.user) {
        let currentUserData = { ...session.user };

        // Ambil data pasien (patient_profile)
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();

        if (patientError && patientError.code !== 'PGRST116') {
          console.error("Error fetching patient profile:", patientError.message);
        } else if (patientData) {
          currentUserData.patient_profile = patientData;
        }

        // Ambil data staf (staff_profile)
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();

        if (staffError && staffError.code !== 'PGRST116') {
          console.error("Error fetching staff profile:", staffError.message);
        } else if (staffData) {
          currentUserData.staff_profile = staffData;
        }

        setUser(currentUserData);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getSessionAndProfiles();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
          getSessionAndProfiles();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login');
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const value = {
    user,
    loading,
    signIn: async (email, password) => {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    },
    signUp: async (email, password) => {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { data, error };
    },
    signOut: async () => {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      return { error };
    },
    isAuthenticated: !!user && user.id,
    userProfile: user?.patient_profile || null,
    staffProfile: user?.staff_profile || null, // Ini yang penting untuk peran staf
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
          <p className="ml-2 text-lg text-gray-700">Memuat sesi pengguna...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};