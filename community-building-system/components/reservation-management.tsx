"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, Users, Search, Filter, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { SpaceReservation } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { mockCommonSpaces } from "@/lib/mock-data"

interface ReservationManagementProps {
  reservations: SpaceReservation[]
  onCancelReservation: (reservationId: string) => void
}

export function ReservationManagement({ reservations, onCancelReservation }: ReservationManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [spaceFilter, setSpaceFilter] = useState<string>("all")

  // Filtrar reservas
  const filteredReservations = reservations.filter((reservation) => {
    const space = mockCommonSpaces.find((s) => s.id === reservation.space_id)
    const spaceName = space?.name || ""

    const matchesSearch =
      spaceName.toLowerCase().includes(searchTerm.toLowerCase()) || reservation.date.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    const matchesSpace = spaceFilter === "all" || reservation.space_id === spaceFilter

    return matchesSearch && matchesStatus && matchesSpace
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            Confirmada
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  const canCancelReservation = (reservation: SpaceReservation) => {
    const reservationDateTime = new Date(`${reservation.date}T${reservation.start_time}`)
    const now = new Date()
    const hoursUntilReservation = (reservationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return reservation.status === "confirmed" && hoursUntilReservation > 24
  }

  const handleCancelReservation = (reservationId: string) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      onCancelReservation(reservationId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
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
                  placeholder="Buscar por espacio o fecha..."
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

      {/* Lista de Reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Reservas</CardTitle>
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
                <p className="text-muted-foreground">
                  {reservations.length === 0
                    ? "No tienes reservas registradas aún"
                    : "Intenta ajustar los filtros para ver más resultados"}
                </p>
              </div>
            ) : (
              filteredReservations.map((reservation) => {
                const space = mockCommonSpaces.find((s) => s.id === reservation.space_id)
                const reservationDate = new Date(reservation.date)
                const isUpcoming = reservationDate > new Date()

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
                            <p className="text-sm text-muted-foreground">{space?.description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {reservationDate.toLocaleDateString("es-CL", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
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

                        {canCancelReservation(reservation) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>

                    {reservation.status === "confirmed" && isUpcoming && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Recuerda que el pago se realiza al momento de usar el espacio.
                          {space?.hourly_rate && (
                            <span>
                              {" "}
                              Costo estimado:{" "}
                              {formatCurrency(
                                (Number.parseInt(reservation.end_time.split(":")[0]) -
                                  Number.parseInt(reservation.start_time.split(":")[0])) *
                                  space.hourly_rate,
                              )}
                            </span>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
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
