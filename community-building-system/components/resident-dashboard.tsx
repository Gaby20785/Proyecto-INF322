"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { CreditCard, Calendar, Users, Bell, LogOut, Home, DollarSign, AlertCircle } from "lucide-react"
import {
  mockCommonExpenses,
  mockCommonSpaces,
  mockAnnouncements,
  mockReservations,
  mockVisitors,
} from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { PaymentModal } from "./payment-modal"
import { PaymentHistory } from "./payment-history"
import { ReservationModal } from "./reservation-modal"
import { ReservationManagement } from "./reservation-management"
import { VisitorManagement } from "./visitor-management"
import { CommunicationsSystem } from "./communications-system"
import type { CommonExpense, CommonSpace, SpaceReservation, Visitor } from "@/lib/types"

export function ResidentDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedExpense, setSelectedExpense] = useState<CommonExpense | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState<CommonSpace | null>(null)
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const [expenses, setExpenses] = useState(mockCommonExpenses)
  const [reservations, setReservations] = useState(mockReservations)
  const [visitors, setVisitors] = useState(mockVisitors)

  // Filtrar datos del usuario actual
  const userExpenses = expenses.filter((expense) => expense.user_id === user?.id)
  const pendingExpenses = userExpenses.filter((expense) => expense.status === "pending")
  const userReservations = reservations.filter((reservation) => reservation.user_id === user?.id)
  const upcomingReservations = userReservations.filter((reservation) => {
    const reservationDate = new Date(reservation.date)
    return reservationDate > new Date() && reservation.status === "confirmed"
  })
  const userVisitors = visitors.filter((visitor) => visitor.user_id === user?.id)
  const activeVisitors = userVisitors.filter((visitor) => {
    const visitDate = new Date(visitor.visit_date)
    const today = new Date()
    return visitDate.toDateString() === today.toDateString() && visitor.status === "approved"
  })
  const recentAnnouncements = mockAnnouncements.slice(0, 3)

  const handleLogout = () => {
    logout()
  }

  const handlePayExpense = (expense: CommonExpense) => {
    setSelectedExpense(expense)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = (expenseId: string) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === expenseId
          ? { ...expense, status: "paid" as const, paid_date: new Date().toISOString() }
          : expense,
      ),
    )
    setIsPaymentModalOpen(false)
    setSelectedExpense(null)
  }

  const handleReserveSpace = (space: CommonSpace) => {
    setSelectedSpace(space)
    setIsReservationModalOpen(true)
  }

  const handleReservationSuccess = (reservation: SpaceReservation) => {
    setReservations((prev) => [...prev, reservation])
    setIsReservationModalOpen(false)
    setSelectedSpace(null)
  }

  const handleCancelReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status: "cancelled" as const } : reservation,
      ),
    )
  }

  const handleRegisterVisitor = (visitor: Visitor) => {
    setVisitors((prev) => [...prev, visitor])
  }

  const handleUpdateVisitorStatus = (visitorId: string, status: Visitor["status"]) => {
    setVisitors((prev) => prev.map((visitor) => (visitor.id === visitorId ? { ...visitor, status } : visitor)))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ComunidadApp</h1>
                <p className="text-sm text-muted-foreground">Edificio Los Robles</p>
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
                  <p className="text-xs text-muted-foreground">Depto. {user?.apartment}</p>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Inicio</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Pagos</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Reservas</span>
            </TabsTrigger>
            <TabsTrigger value="visitors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Visitas</span>
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Comunicados</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Gastos Pendientes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gastos Pendientes</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {pendingExpenses.length} {pendingExpenses.length === 1 ? "pago pendiente" : "pagos pendientes"}
                  </p>
                  {pendingExpenses.length > 0 && (
                    <Button size="sm" className="mt-2 w-full" onClick={() => setActiveTab("payments")}>
                      Ver Pagos
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Próximas Reservas */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Próximas Reservas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingReservations.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {upcomingReservations.length === 0
                      ? "No tienes reservas programadas"
                      : upcomingReservations.length === 1
                        ? "Reserva programada"
                        : "Reservas programadas"}
                  </p>
                  <Button size="sm" className="mt-2 w-full" onClick={() => setActiveTab("reservations")}>
                    {upcomingReservations.length > 0 ? "Ver Reservas" : "Hacer Reserva"}
                  </Button>
                </CardContent>
              </Card>

              {/* Visitas del Día */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visitas de Hoy</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeVisitors.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeVisitors.length === 0
                      ? "No hay visitas programadas"
                      : activeVisitors.length === 1
                        ? "Visita activa"
                        : "Visitas activas"}
                  </p>
                  <Button size="sm" className="mt-2 w-full" onClick={() => setActiveTab("visitors")}>
                    {activeVisitors.length > 0 ? "Ver Visitas" : "Registrar Visita"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Anuncios Recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Anuncios Recientes
                </CardTitle>
                <CardDescription>Últimas comunicaciones de la administración</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      {announcement.priority === "high" ? (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      ) : (
                        <Bell className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{announcement.title}</h4>
                        <Badge
                          variant={announcement.priority === "high" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {announcement.type === "maintenance"
                            ? "Mantención"
                            : announcement.type === "general"
                              ? "General"
                              : announcement.type === "improvement"
                                ? "Mejora"
                                : "Emergencia"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(announcement.created_at).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <PaymentHistory expenses={userExpenses} onPayExpense={handlePayExpense} />
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <Tabs defaultValue="spaces" className="space-y-4">
              <TabsList>
                <TabsTrigger value="spaces">Espacios Disponibles</TabsTrigger>
                <TabsTrigger value="my-reservations">Mis Reservas</TabsTrigger>
              </TabsList>

              <TabsContent value="spaces">
                <Card>
                  <CardHeader>
                    <CardTitle>Espacios Comunes Disponibles</CardTitle>
                    <CardDescription>Reserva los espacios comunes del edificio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {mockCommonSpaces.map((space) => (
                        <Card key={space.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{space.name}</CardTitle>
                            <CardDescription>{space.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>Capacidad:</span>
                              <span className="font-medium">{space.capacity} personas</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Tarifa por hora:</span>
                              <span className="font-medium">{formatCurrency(space.hourly_rate || 0)}</span>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Amenidades:</p>
                              <div className="flex flex-wrap gap-1">
                                {space.amenities.map((amenity, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button className="w-full" onClick={() => handleReserveSpace(space)}>
                              Reservar Espacio
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="my-reservations">
                <ReservationManagement reservations={userReservations} onCancelReservation={handleCancelReservation} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Visitors Tab */}
          <TabsContent value="visitors" className="space-y-6">
            <VisitorManagement
              visitors={userVisitors}
              onRegisterVisitor={handleRegisterVisitor}
              onUpdateVisitorStatus={handleUpdateVisitorStatus}
            />
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <CommunicationsSystem userType="resident" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        expense={selectedExpense}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedExpense(null)
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Reservation Modal */}
      <ReservationModal
        space={selectedSpace}
        isOpen={isReservationModalOpen}
        onClose={() => {
          setIsReservationModalOpen(false)
          setSelectedSpace(null)
        }}
        onReservationSuccess={handleReservationSuccess}
      />
    </div>
  )
}
