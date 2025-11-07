// Sistema de autenticación mock
import type { User } from "./types"
import { mockUsers } from "./mock-data"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Simulación de autenticación
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Buscar usuario por email
  const user = mockUsers.find((u) => u.email === email)

  // Validación simple (en producción usar hash de contraseña)
  if (user && password === "password123") {
    return user
  }

  return null
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("currentUser")
  return userData ? JSON.parse(userData) : null
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window === "undefined") return

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export const logout = () => {
  setCurrentUser(null)
}
