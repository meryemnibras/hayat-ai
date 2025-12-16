export type ConversationRow = {
  id: string;
  patient: string;
  channel: string;
  status: string;
  updatedAt: string;
};

export type AppointmentRow = {
  id: string;
  patient: string;
  provider: string;
  status: string;
  start: string;
};

export type PatientRow = {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  lastVisit?: string;
};

export const mockConversations: ConversationRow[] = [
  {
    id: "conv-1",
    patient: "ليان العتيبي",
    channel: "WhatsApp",
    status: "OPEN",
    updatedAt: "2025-12-15T08:30:00Z",
  },
  {
    id: "conv-2",
    patient: "Ayşe Demir",
    channel: "Chat",
    status: "OPEN",
    updatedAt: "2025-12-15T08:10:00Z",
  },
  {
    id: "conv-3",
    patient: "Sarah Smith",
    channel: "Chat",
    status: "CLOSED",
    updatedAt: "2025-12-14T17:45:00Z",
  },
];

export const mockAppointments: AppointmentRow[] = [
  {
    id: "apt-1",
    patient: "ليان العتيبي",
    provider: "د. نوف",
    status: "CONFIRMED",
    start: "2025-12-16T09:00:00Z",
  },
  {
    id: "apt-2",
    patient: "Ayşe Demir",
    provider: "Dr. Kaya",
    status: "SCHEDULED",
    start: "2025-12-16T11:00:00Z",
  },
  {
    id: "apt-3",
    patient: "Sarah Smith",
    provider: "Dr. Patel",
    status: "COMPLETED",
    start: "2025-12-14T14:00:00Z",
  },
];

export const mockPatients: PatientRow[] = [
  {
    id: "pt-1",
    name: "ليان العتيبي",
    phone: "+966500000000",
    tags: ["VIP", "Botox"],
    lastVisit: "2025-12-10",
  },
  {
    id: "pt-2",
    name: "Ayşe Demir",
    phone: "+905300000000",
    tags: ["Filler"],
    lastVisit: "2025-12-08",
  },
  {
    id: "pt-3",
    name: "Sarah Smith",
    phone: "+971500000000",
    tags: ["Consult"],
    lastVisit: "2025-12-12",
  },
];

export const overviewStats = [
  { label: "المواعيد اليوم", value: 38, delta: "+6%" },
  { label: "المحادثات النشطة", value: 24, delta: "+12%" },
  { label: "معدل الرضا", value: "4.9", delta: "↑" },
  { label: "حجوزات الواتساب", value: 17, delta: "+9%" },
];

export const analyticsSeries = [
  { day: "Mon", bookings: 22, revenue: 11 },
  { day: "Tue", bookings: 28, revenue: 15 },
  { day: "Wed", bookings: 31, revenue: 16 },
  { day: "Thu", bookings: 29, revenue: 17 },
  { day: "Fri", bookings: 34, revenue: 19 },
  { day: "Sat", bookings: 18, revenue: 9 },
  { day: "Sun", bookings: 12, revenue: 6 },
];



