"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
} from "lucide-react"
import { mockReservations, mockCommonSpaces, mockUsers } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"

export function AdminReservationsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [spaceFilter, setSpaceFilter] = useState<string>("all")

  const filteredReservations = mockReservations.filter((reservation) => {
    const space = mockCommonSpaces.find((s) => s.id === reservation.space_id)
    const user = mockUsers.find((u) => u.id === reservation.user_id)
    const spaceName = space?.name || ""
    const userName = user?.name || ""

    const matchesSearch =
      spaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.date.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    const matchesSpace = spaceFilter === "all" || reservation.space_id === spaceFilter

    return matchesSearch && matchesStatus && matchesSpace
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Confirmada
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  const calculateRevenue = (reservation: any) => {
    const space = mockCommonSpaces.find((s) => s.id === reservation.space_id)
    if (!space?.hourly_rate) return 0

    const startHour = Number.parseInt(reservation.start_time.split(":")[0])
    const endHour = Number.parseInt(reservation.end_time.split(":")[0])
    const hours = endHour - startHour

    return hours * space.hourly_rate
  }

  const totalRevenue = filteredReservations
    .filter((r) => r.status === "confirmed")
    .reduce((sum, reservation) => sum + calculateRevenue(reservation), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Reservas</h2>
          <p className="text-muted-foreground">Administra las reservas de espacios comunes</p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Configurar Espacios
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReservations.length}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReservations.filter((r) => r.status === "confirmed").length}</div>
            <p className="text-xs text-muted-foreground">Reservas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Por reservas confirmadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espacios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCommonSpaces.length}</div>
            <p className="text-xs text-muted-foreground">Espacios disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por espacio, residente o fecha..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Espacio</label>
              <Select value={spaceFilter} onValueChange={setSpaceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los espacios</SelectItem>
                  {mockCommonSpaces.map((space) => (
                    <SelectItem key={space.id} value={space.id}>
                      {space.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Reservas</CardTitle>
          <CardDescription>
            {filteredReservations.length}{" "}
            {filteredReservations.length === 1 ? "reserva encontrada" : "reservas encontradas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReservations.length === 0 ? (
              <div className="text-center py-8">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron reservas</h3>
                <p className="text-muted-foreground">Intenta ajustar los filtros para ver más resultados</p>
              </div>
            ) : (
              filteredReservations.map((reservation) => {
                const space = mockCommonSpaces.find((s) => s.id === reservation.space_id)
                const user = mockUsers.find((u) => u.id === reservation.user_id)
                const reservationDate = new Date(reservation.date)
                const revenue = calculateRevenue(reservation)

                return (
                  <div key={reservation.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">{getStatusIcon(reservation.status)}</div>
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              {space?.name || "Espacio no encontrado"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Reservado por: {user?.name} - Depto. {user?.apartment}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{reservationDate.toLocaleDateString("es-CL")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {reservation.start_time} - {reservation.end_time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>Hasta {space?.capacity} personas</span>
                            </div>
                            {revenue > 0 && <div className="font-medium">Ingreso: {formatCurrency(revenue)}</div>}
                          </div>

                          {reservation.notes && (
                            <div className="text-sm">
                              <span className="font-medium">Notas: </span>
                              <span className="text-muted-foreground">{reservation.notes}</span>
                            </div>
                          )}

                          <div className="text-sm text-muted-foreground">
                            Reservado el: {new Date(reservation.created_at).toLocaleDateString("es-CL")}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(reservation.status)}

                        {reservation.status === "pending" && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Aprobar
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                              Rechazar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
