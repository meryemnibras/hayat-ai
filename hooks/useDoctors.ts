import { useState, useEffect } from "react";

export interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  yearsExperience: number;
  hospitalAffiliation?: string | null;
  availabilitySchedule?: any;
  languagesSpoken: string[];
  createdAt: string;
  updatedAt: string;
}

interface UseDoctorsResult {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDoctors(specialization?: string, language?: string): UseDoctorsResult {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (specialization) params.append("specialization", specialization);
      if (language) params.append("language", language);

      const response = await fetch(`/api/doctors?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setDoctors(data.doctors || []);
      } else {
        setError(data.error || "Failed to fetch doctors");
        setDoctors([]);
      }
    } catch (err: any) {
      console.error("Error fetching doctors:", err);
      setError(err.message || "Failed to fetch doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization, language]);

  return {
    doctors,
    loading,
    error,
    refetch: fetchDoctors,
  };
}



