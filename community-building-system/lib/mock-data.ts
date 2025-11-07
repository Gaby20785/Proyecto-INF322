// Datos mock para desarrollo
import type { User, Building, CommonExpense, SpaceReservation, CommonSpace, Visitor, Announcement } from "./types"

export const mockBuilding: Building = {
  id: "1",
  name: "Edificio Los Robles",
  address: "Av. Providencia 1234, Providencia, Santiago",
  total_apartments: 48,
  admin_company: "Administradora ProComunidad",
  created_at: "2024-01-01T00:00:00Z",
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@procomunidad.cl",
    name: "María González",
    apartment: "Administración",
    phone: "+56912345678",
    role: "admin",
    building_id: "1",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "juan.perez@email.com",
    name: "Juan Pérez",
    apartment: "301",
    phone: "+56987654321",
    role: "resident",
    building_id: "1",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    email: "ana.silva@email.com",
    name: "Ana Silva",
    apartment: "205",
    phone: "+56976543210",
    role: "resident",
    building_id: "1",
    created_at: "2024-01-20T00:00:00Z",
  },
]

export const mockCommonExpenses: CommonExpense[] = [
  {
    id: "1",
    user_id: "2",
    building_id: "1",
    month: "Enero",
    year: 2025,
    amount: 85000,
    description: "Gastos comunes - Enero 2025",
    status: "pending",
    due_date: "2025-01-15",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    user_id: "3",
    building_id: "1",
    month: "Enero",
    year: 2025,
    amount: 85000,
    description: "Gastos comunes - Enero 2025",
    status: "paid",
    due_date: "2025-01-15",
    paid_date: "2025-01-10",
    created_at: "2025-01-01T00:00:00Z",
  },
]

export const mockCommonSpaces: CommonSpace[] = [
  {
    id: "1",
    building_id: "1",
    name: "Salón de Eventos",
    description: "Amplio salón para celebraciones y reuniones",
    capacity: 50,
    hourly_rate: 25000,
    available_hours: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
    amenities: ["Cocina equipada", "Sistema de audio", "Mesas y sillas", "Aire acondicionado"],
    is_active: true,
  },
  {
    id: "2",
    building_id: "1",
    name: "Quincho",
    description: "Espacio al aire libre con parrilla",
    capacity: 20,
    hourly_rate: 15000,
    available_hours: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    amenities: ["Parrilla", "Mesas de picnic", "Lavaplatos", "Refrigerador"],
    is_active: true,
  },
]

export const mockReservations: SpaceReservation[] = [
  {
    id: "1",
    user_id: "2",
    space_id: "1",
    date: "2025-01-20",
    start_time: "15:00",
    end_time: "18:00",
    status: "confirmed",
    notes: "Cumpleaños familiar",
    created_at: "2025-01-10T10:00:00Z",
  },
  {
    id: "2",
    user_id: "2",
    space_id: "2",
    date: "2025-01-25",
    start_time: "12:00",
    end_time: "16:00",
    status: "confirmed",
    notes: "Asado con amigos",
    created_at: "2025-01-12T14:30:00Z",
  },
]

export const mockVisitors: Visitor[] = [
  {
    id: "1",
    user_id: "2",
    name: "Carlos Mendoza",
    document_id: "12.345.678-9",
    phone: "+56 9 8765 4321",
    visit_date: "2025-01-15",
    visit_time: "14:30",
    status: "approved",
    notes: "Técnico de reparaciones",
    created_at: "2025-01-14T10:00:00Z",
  },
  {
    id: "2",
    user_id: "2",
    name: "María Fernández",
    document_id: "98.765.432-1",
    phone: "+56 9 1234 5678",
    visit_date: "2025-01-18",
    visit_time: "16:00",
    status: "completed",
    notes: "Visita familiar",
    created_at: "2025-01-17T09:30:00Z",
  },
  {
    id: "3",
    user_id: "2",
    name: "Roberto Silva",
    document_id: "11.222.333-4",
    phone: "+56 9 9876 5432",
    visit_date: "2025-01-22",
    visit_time: "10:00",
    status: "approved",
    notes: "Delivery de compras",
    created_at: "2025-01-21T08:15:00Z",
  },
]

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    building_id: "1",
    title: "Mantención de ascensores programada",
    content:
      "Se realizará mantención preventiva de los ascensores el día sábado 15 de enero de 9:00 a 13:00 hrs. Durante este período, los ascensores no estarán disponibles.",
    type: "maintenance",
    priority: "high",
    author_id: "1",
    is_pinned: true,
    created_at: "2025-01-08T10:00:00Z",
    updated_at: "2025-01-08T10:00:00Z",
  },
  {
    id: "2",
    building_id: "1",
    title: "Nueva política de reservas",
    content:
      "A partir del 1 de febrero, las reservas de espacios comunes deberán realizarse con al menos 48 horas de anticipación.",
    type: "general",
    priority: "medium",
    author_id: "1",
    is_pinned: false,
    created_at: "2025-01-05T14:30:00Z",
    updated_at: "2025-01-05T14:30:00Z",
  },
]
