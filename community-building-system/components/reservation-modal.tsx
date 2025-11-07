"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, Users, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import type { CommonSpace, SpaceReservation } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { AvailabilityCalendar } from "./availability-calendar"

interface ReservationModalProps {
  space: CommonSpace | null
  isOpen: boolean
  onClose: () => void
  onReservationSuccess: (reservation: SpaceReservation) => void
}

export function ReservationModal({ space, isOpen, onClose, onReservationSuccess }: ReservationModalProps) {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [reservationComplete, setReservationComplete] = useState(false)

  if (!space) return null

  const getSpaceAvailabilityData = () => {
    const data = []
    const today = new Date()

    for (let i = 1; i <= 60; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split("T")[0]
      const dayOfWeek = date.getDay()

      const isAvailable = dayOfWeek !== 0 && Math.random() > 0.2

      data.push({
        date: dateString,
        available: isAvailable,
        reservations: isAvailable ? Math.floor(Math.random() * 3) : 0,
        maxCapacity: 5,
        reason: dayOfWeek === 0 ? "Cerrado los domingos" : !isAvailable ? "Mantenimiento programado" : undefined,
      })
    }

    return data
  }

  const calculateTotal = () => {
    if (!startTime || !endTime || !space.hourly_rate) return 0

    const start = Number.parseInt(startTime.split(":")[0])
    const end = Number.parseInt(endTime.split(":")[0])
    const hours = end - start

    return hours > 0 ? hours * space.hourly_rate : 0
  }

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newReservation: SpaceReservation = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: user?.id || "",
      space_id: space.id,
      date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      status: "confirmed",
      notes: notes || undefined,
      created_at: new Date().toISOString(),
    }

    setIsProcessing(false)
    setReservationComplete(true)

    setTimeout(() => {
      onReservationSuccess(newReservation)
      setReservationComplete(false)
      onClose()
      setSelectedDate("")
      setStartTime("")
      setEndTime("")
      setNotes("")
    }, 2000)
  }

  const spaceAvailabilityData = getSpaceAvailabilityData()
  const total = calculateTotal()

  if (reservationComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">¡Reserva Confirmada!</h3>
            <p className="text-muted-foreground mb-4">Tu reserva para {space.name} ha sido confirmada exitosamente.</p>
            <p className="text-sm text-muted-foreground">Recibirás un correo de confirmación con todos los detalles.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Reservar {space.name}
          </DialogTitle>
          <DialogDescription>Completa los detalles para tu reserva</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <AvailabilityCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              availabilityData={spaceAvailabilityData}
              disabledDays={[0]}
              showAvailability={true}
              className="w-full"
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {space.name}
                </CardTitle>
                <CardDescription>{space.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Capacidad: {space.capacity} personas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Tarifa: {formatCurrency(space.hourly_rate || 0)}/hora</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Amenidades incluidas:</p>
                  <div className="flex flex-wrap gap-1">
                    {space.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleReservation} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora de inicio</Label>
                  <Select value={startTime} onValueChange={setStartTime} required disabled={!selectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Hora inicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {space.available_hours.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora de término</Label>
                  <Select value={endTime} onValueChange={setEndTime} required disabled={!startTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Hora término" />
                    </SelectTrigger>
                    <SelectContent>
                      {space.available_hours.map((hour) => {
                        const hourNum = Number.parseInt(hour.split(":")[0])
                        const startHourNum = startTime ? Number.parseInt(startTime.split(":")[0]) : 0
                        return hourNum > startHourNum ? (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ) : null
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe el tipo de evento o cualquier requerimiento especial..."
                  rows={3}
                />
              </div>

              {total > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen de Costos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Fecha:</span>
                      <span className="font-medium">
                        {selectedDate
                          ? new Date(selectedDate).toLocaleDateString("es-CL", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duración:</span>
                      <span className="font-medium">
                        {startTime && endTime
                          ? `${Number.parseInt(endTime.split(":")[0]) - Number.parseInt(startTime.split(":")[0])} horas`
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tarifa por hora:</span>
                      <span className="font-medium">{formatCurrency(space.hourly_rate || 0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Las reservas deben realizarse con al menos 24 horas de anticipación. El pago se realizará al momento
                  de usar el espacio.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing || !selectedDate || !startTime || !endTime}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar Reserva"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
