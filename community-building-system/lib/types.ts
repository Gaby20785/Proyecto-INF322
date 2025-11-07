// Tipos de datos para el sistema de gestión comunitaria

export interface User {
  id: string
  email: string
  name: string
  apartment: string
  phone: string
  role: "resident" | "admin"
  building_id: string
  created_at: string
}

export interface Building {
  id: string
  name: string
  address: string
  total_apartments: number
  admin_company: string
  created_at: string
}

export interface CommonExpense {
  id: string
  user_id: string
  building_id: string
  month: string
  year: number
  amount: number
  description: string
  status: "pending" | "paid" | "overdue"
  due_date: string
  paid_date?: string
  created_at: string
}

export interface SpaceReservation {
  id: string
  user_id: string
  space_id: string
  date: string
  start_time: string
  end_time: string
  status: "pending" | "confirmed" | "cancelled"
  notes?: string
  created_at: string
}

export interface CommonSpace {
  id: string
  building_id: string
  name: string
  description: string
  capacity: number
  hourly_rate?: number
  available_hours: string[]
  amenities: string[]
  image_url?: string
  is_active: boolean
}

export interface Visitor {
  id: string
  user_id: string
  name: string
  document_id: string
  phone: string
  visit_date: string
  visit_time: string
  status: "pending" | "approved" | "rejected" | "completed"
  notes?: string
  created_at: string
}

export interface Announcement {
  id: string
  building_id: string
  title: string
  content: string
  type: "maintenance" | "improvement" | "general" | "emergency"
  priority: "low" | "medium" | "high"
  author_id: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface MaintenancePlan {
  id: string
  building_id: string
  title: string
  description: string
  category: "preventive" | "corrective" | "improvement"
  status: "planned" | "in_progress" | "completed" | "cancelled"
  start_date: string
  end_date?: string
  budget: number
  contractor?: string
  created_at: string
  updated_at: string
}
