import { useState, useEffect } from "react";

export interface Patient {
  id: string;
  clinicId: string;
  clinic?: {
    name: string;
    city?: string;
  };
  fullName: string;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  medicalHistorySummary?: string | null;
  allergies?: string | null;
  preferredLanguage?: string | null;
  notes?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface UsePatientsResult {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePatients(
  clinicId?: string,
  gender?: string,
  preferredLanguage?: string
): UsePatientsResult {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (clinicId) params.append("clinicId", clinicId);
      if (gender) params.append("gender", gender);
      if (preferredLanguage) params.append("preferredLanguage", preferredLanguage);

      const response = await fetch(`/api/patients?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPatients(data.patients || []);
      } else {
        setError(data.error || "Failed to fetch patients");
        setPatients([]);
      }
    } catch (err: any) {
      console.error("Error fetching patients:", err);
      setError(err.message || "Failed to fetch patients");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [clinicId, gender, preferredLanguage]);

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients,
  };
}

