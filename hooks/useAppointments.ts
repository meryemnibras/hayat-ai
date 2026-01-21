import { useState, useEffect } from "react";

export interface Appointment {
  id: string;
  clinicId: string;
  clinic?: {
    id: string;
    name: string;
    addressLine1?: string | null;
    city?: string | null;
  };
  patientId: string;
  patient?: {
    id: string;
    fullName: string;
    email?: string | null;
    phone?: string | null;
  };
  providerId?: string | null;
  provider?: {
    id: string;
    fullName: string;
    title?: string | null;
    email?: string | null;
  };
  status: string;
  source: string;
  title?: string | null;
  startTime: string;
  endTime?: string | null;
  location?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UseAppointmentsResult {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAppointments(
  clinicId?: string,
  patientId?: string,
  providerId?: string,
  status?: string,
  startDate?: string,
  endDate?: string
): UseAppointmentsResult {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (clinicId) params.append("clinicId", clinicId);
      if (patientId) params.append("patientId", patientId);
      if (providerId) params.append("providerId", providerId);
      if (status) params.append("status", status);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`/api/appointments?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setAppointments(data.appointments || []);
      } else {
        setError(data.error || "Failed to fetch appointments");
        setAppointments([]);
      }
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err.message || "Failed to fetch appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [clinicId, patientId, providerId, status, startDate, endDate]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
  };
}




















