"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import {
  LogOut,
  Home,
  Users,
  DollarSign,
  Calendar,
  Bell,
  Settings,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  UserCheck,
  CreditCard,
  MapPin,
} from "lucide-react"
import { mockUsers, mockCommonExpenses, mockReservations, mockVisitors, mockCommonSpaces } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { AdminResidentsManagement } from "./admin-residents-management"
import { AdminFinancialReports } from "./admin-financial-reports"
import { AdminReservationsManagement } from "./admin-reservations-management"
import { AdminAnnouncementManagement } from "./admin-announcement-management"
import { CommunicationsSystem } from "./communications-system"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = () => {
    logout()
  }

  // Calcular estadísticas
  const totalResidents = mockUsers.filter((u) => u.role === "resident").length
  const totalRevenue = mockCommonExpenses
    .filter((e) => e.status === "paid")
    .reduce((sum, expense) => sum + expense.amount, 0)
  const pendingPayments = mockCommonExpenses.filter((e) => e.status === "pending").length
  const activeReservations = mockReservations.filter((r) => r.status === "confirmed").length
  const todayVisitors = mockVisitors.filter((v) => {
    const today = new Date().toISOString().split("T")[0]
    return v.visit_date === today && v.status === "approved"
  }).length
  const maintenanceIssues = 2 // Mock data

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Building className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ComunidadApp - Administración</h1>
                <p className="text-sm text-muted-foreground">Panel de Control - Edificio Los Robles</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <AvatarInitials name={user?.name || ""} />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    Administrador
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="residents" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Residentes</span>
            </TabsTrigger>
            <TabsTrigger value="finances" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Finanzas</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Reservas</span>
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Comunicados</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Mensajes</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Residentes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalResidents}</div>
                  <p className="text-xs text-muted-foreground">de 48 departamentos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    +12% vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingPayments}</div>
                  <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeReservations}</div>
                  <p className="text-xs text-muted-foreground">Para esta semana</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Funciones principales de administración</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <Button
                    className="justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("communications")}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Crear Anuncio
                  </Button>
                  <Button
                    className="justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("finances")}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Reportes Financieros
                  </Button>
                  <Button
                    className="justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("reservations")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Gestionar Reservas
                  </Button>
                  <Button className="justify-start bg-transparent" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Programar Mantención
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Pago recibido - Depto. 205</p>
                        <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Nueva reserva - Salón de eventos</p>
                        <p className="text-xs text-muted-foreground">Hace 4 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Visita registrada - Depto. 301</p>
                        <p className="text-xs text-muted-foreground">Hace 6 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Reporte de mantención - Ascensor 2</p>
                        <p className="text-xs text-muted-foreground">Hace 1 día</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Overview */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Today's Visitors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Visitas de Hoy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{todayVisitors}</div>
                  <p className="text-sm text-muted-foreground">Visitantes esperados hoy</p>
                </CardContent>
              </Card>

              {/* Maintenance Issues */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Mantenciones Pendientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{maintenanceIssues}</div>
                  <p className="text-sm text-muted-foreground">Requieren atención</p>
                </CardContent>
              </Card>

              {/* Space Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Espacios Comunes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{mockCommonSpaces.length}</div>
                  <p className="text-sm text-muted-foreground">Espacios disponibles</p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts & Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Alertas y Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Mantención programada</p>
                      <p className="text-xs text-muted-foreground">
                        Ascensor 2 requiere mantención preventiva esta semana
                      </p>
                    </div>
                    <Badge variant="secondary">Pendiente</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reunión de consorcio</p>
                      <p className="text-xs text-muted-foreground">Programada para el 25 de enero a las 19:00 hrs</p>
                    </div>
                    <Badge variant="secondary">Próxima</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pago de servicios</p>
                      <p className="text-xs text-muted-foreground">
                        Todos los servicios básicos han sido pagados este mes
                      </p>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Completado
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Residents Tab */}
          <TabsContent value="residents" className="space-y-6">
            <AdminResidentsManagement />
          </TabsContent>

          {/* Finances Tab */}
          <TabsContent value="finances" className="space-y-6">
            <AdminFinancialReports />
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <AdminReservationsManagement />
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <AdminAnnouncementManagement />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <CommunicationsSystem userType="admin" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
