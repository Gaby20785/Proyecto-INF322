"use client"

import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/login-form"
import { ResidentDashboard } from "@/components/resident-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  // Redirigir según el rol del usuario
  if (user?.role === "admin") {
    return <AdminDashboard />
  }

  return <ResidentDashboard />
}
