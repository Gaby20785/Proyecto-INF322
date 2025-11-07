"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, User, Clock, Phone, Award as IdCard } from "lucide-react"
import type { Visitor } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import { AvailabilityCalendar } from "./availability-calendar"

interface VisitorRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onVisitorRegistered: (visitor: Visitor) => void
}

export function VisitorRegistrationModal({ isOpen, onClose, onVisitorRegistered }: VisitorRegistrationModalProps) {
  const { user } = useAuth()
  const [visitorName, setVisitorName] = useState("")
  const [documentId, setDocumentId] = useState("")
  const [phone, setPhone] = useState("")
  const [visitDate, setVisitDate] = useState("")
  const [visitTime, setVisitTime] = useState("")
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  const getVisitorAvailabilityData = () => {
    const data = []
    const today = new Date()

    for (let i = 0; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split("T")[0]

      data.push({
        date: dateString,
        available: true,
        reservations: Math.floor(Math.random() * 15),
        maxCapacity: 50,
        reason: undefined,
      })
    }

    return data
  }

  const getAvailableTimes = () => {
    const times = []
    for (let hour = 8; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        times.push(timeString)
      }
    }
    return times
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newVisitor: Visitor = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: user?.id || "",
      name: visitorName,
      document_id: documentId,
      phone: phone,
      visit_date: visitDate,
      visit_time: visitTime,
      status: "approved",
      notes: notes || undefined,
      created_at: new Date().toISOString(),
    }

    setIsProcessing(false)
    setRegistrationComplete(true)

    setTimeout(() => {
      onVisitorRegistered(newVisitor)
      setRegistrationComplete(false)
      onClose()
      setVisitorName("")
      setDocumentId("")
      setPhone("")
      setVisitDate("")
      setVisitTime("")
      setNotes("")
    }, 2000)
  }

  const formatDocumentId = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 1) return cleaned

    const body = cleaned.slice(0, -1)
    const dv = cleaned.slice(-1)

    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return dv ? `${formatted}-${dv}` : formatted
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.startsWith("56")) {
      const number = cleaned.slice(2)
      if (number.length <= 1) return `+56 ${number}`
      if (number.length <= 5) return `+56 ${number.slice(0, 1)} ${number.slice(1)}`
      return `+56 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5, 9)}`
    }
    if (cleaned.length <= 1) return cleaned
    if (cleaned.length <= 5) return `${cleaned.slice(0, 1)} ${cleaned.slice(1)}`
    return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5, 9)}`
  }

  const visitorAvailabilityData = getVisitorAvailabilityData()
  const availableTimes = getAvailableTimes()

  if (registrationComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">¡Visita Registrada!</h3>
            <p className="text-muted-foreground mb-4">La visita de {visitorName} ha sido registrada exitosamente.</p>
            <p className="text-sm text-muted-foreground">
              El visitante podrá ingresar presentando su cédula de identidad.
            </p>
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
            <User className="w-5 h-5" />
            Registrar Nueva Visita
          </DialogTitle>
          <DialogDescription>Registra los datos del visitante para facilitar su acceso al edificio</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <AvailabilityCalendar
              selectedDate={visitDate}
              onDateSelect={setVisitDate}
              availabilityData={visitorAvailabilityData}
              disabledDays={[]}
              showAvailability={false}
              className="w-full"
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Residente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Residente:</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Departamento:</span>
                  <span className="font-medium">{user?.apartment}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Teléfono:</span>
                  <span className="font-medium">{user?.phone}</span>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleRegistration} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitorName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre completo del visitante
                  </Label>
                  <Input
                    id="visitorName"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Ej: Juan Carlos Pérez González"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentId" className="flex items-center gap-2">
                    <IdCard className="w-4 h-4" />
                    RUT o Cédula de Identidad
                  </Label>
                  <Input
                    id="documentId"
                    value={documentId}
                    onChange={(e) => setDocumentId(formatDocumentId(e.target.value))}
                    placeholder="12.345.678-9"
                    maxLength={12}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono de contacto
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="+56 9 1234 5678"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitTime" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hora aproximada de visita
                  </Label>
                  <Select value={visitTime} onValueChange={setVisitTime} required disabled={!visitDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Motivo de la visita, instrucciones especiales, etc..."
                    rows={3}
                  />
                </div>
              </div>

              {visitDate && visitTime && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen de la Visita</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fecha:</span>
                      <span className="font-medium">
                        {new Date(visitDate).toLocaleDateString("es-CL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Hora:</span>
                      <span className="font-medium">{visitTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Visitante:</span>
                      <span className="font-medium">{visitorName || "Por completar"}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  El visitante debe presentar su cédula de identidad en portería. La visita será válida por 24 horas
                  desde la hora registrada.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing || !visitorName || !documentId || !phone || !visitDate || !visitTime}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar Visita"
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
