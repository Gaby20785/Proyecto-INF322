"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Calendar,
  Clock,
  Phone,
  Award as IdCard,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
} from "lucide-react"
import type { Visitor } from "@/lib/types"
import { VisitorRegistrationModal } from "./visitor-registration-modal"

interface VisitorManagementProps {
  visitors: Visitor[]
  onRegisterVisitor: (visitor: Visitor) => void
  onUpdateVisitorStatus: (visitorId: string, status: Visitor["status"]) => void
}

export function VisitorManagement({ visitors, onRegisterVisitor, onUpdateVisitorStatus }: VisitorManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  // Filtrar visitas
  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.document_id.includes(searchTerm) ||
      visitor.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || visitor.status === statusFilter

    let matchesDate = true
    if (dateFilter === "today") {
      const today = new Date().toISOString().split("T")[0]
      matchesDate = visitor.visit_date === today
    } else if (dateFilter === "upcoming") {
      const today = new Date().toISOString().split("T")[0]
      matchesDate = visitor.visit_date >= today
    } else if (dateFilter === "past") {
      const today = new Date().toISOString().split("T")[0]
      matchesDate = visitor.visit_date < today
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            Aprobada
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>
      case "completed":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Completada
          </Badge>
        )
      default:
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  const isVisitActive = (visitor: Visitor) => {
    const visitDateTime = new Date(`${visitor.visit_date}T${visitor.visit_time}`)
    const now = new Date()
    const endTime = new Date(visitDateTime.getTime() + 24 * 60 * 60 * 1000) // 24 horas después

    return visitor.status === "approved" && now >= visitDateTime && now <= endTime
  }

  const canCancelVisit = (visitor: Visitor) => {
    const visitDateTime = new Date(`${visitor.visit_date}T${visitor.visit_time}`)
    const now = new Date()

    return visitor.status === "approved" && visitDateTime > now
  }

  const handleCancelVisit = (visitorId: string) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta visita?")) {
      onUpdateVisitorStatus(visitorId, "rejected")
    }
  }

  const handleCompleteVisit = (visitorId: string) => {
    onUpdateVisitorStatus(visitorId, "completed")
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de registro */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Visitas</h2>
          <p className="text-muted-foreground">Registra y gestiona las visitas a tu departamento</p>
        </div>
        <Button onClick={() => setIsRegistrationModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Registrar Visita
        </Button>
      </div>

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
                  placeholder="Buscar por nombre, RUT o teléfono..."
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
                  <SelectItem value="approved">Aprobada</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fechas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="upcoming">Próximas</SelectItem>
                  <SelectItem value="past">Pasadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Visitas */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Visitas Registradas</CardTitle>
          <CardDescription>
            {filteredVisitors.length} {filteredVisitors.length === 1 ? "visita encontrada" : "visitas encontradas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVisitors.length === 0 ? (
              <div className="text-center py-8">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron visitas</h3>
                <p className="text-muted-foreground mb-4">
                  {visitors.length === 0
                    ? "No tienes visitas registradas aún"
                    : "Intenta ajustar los filtros para ver más resultados"}
                </p>
                {visitors.length === 0 && (
                  <Button onClick={() => setIsRegistrationModalOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrar Primera Visita
                  </Button>
                )}
              </div>
            ) : (
              filteredVisitors.map((visitor) => {
                const visitDate = new Date(visitor.visit_date)
                const isActive = isVisitActive(visitor)
                const canCancel = canCancelVisit(visitor)

                return (
                  <div key={visitor.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">{getStatusIcon(visitor.status)}</div>
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              {visitor.name}
                            </h4>
                            {isActive && (
                              <Alert className="mt-2">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                  Esta visita está activa. El visitante puede ingresar al edificio.
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <IdCard className="w-4 h-4 text-muted-foreground" />
                              <span>{visitor.document_id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{visitor.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{visitDate.toLocaleDateString("es-CL")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{visitor.visit_time}</span>
                            </div>
                          </div>

                          {visitor.notes && (
                            <div className="text-sm">
                              <span className="font-medium">Notas: </span>
                              <span className="text-muted-foreground">{visitor.notes}</span>
                            </div>
                          )}

                          <div className="text-sm text-muted-foreground">
                            Registrado el: {new Date(visitor.created_at).toLocaleDateString("es-CL")}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(visitor.status)}

                        <div className="flex gap-2">
                          {isActive && visitor.status === "approved" && (
                            <Button variant="outline" size="sm" onClick={() => handleCompleteVisit(visitor.id)}>
                              Marcar Completada
                            </Button>
                          )}

                          {canCancel && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelVisit(visitor.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Registro */}
      <VisitorRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onVisitorRegistered={onRegisterVisitor}
      />
    </div>
  )
}
