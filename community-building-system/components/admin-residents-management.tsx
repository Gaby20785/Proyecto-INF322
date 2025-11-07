"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import {
  Users,
  Search,
  Phone,
  Mail,
  Home,
  UserPlus,
  Edit,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { mockUsers, mockCommonExpenses, mockVisitors } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"

export function AdminResidentsManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const residents = mockUsers.filter((user) => user.role === "resident")

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getResidentStats = (userId: string) => {
    const expenses = mockCommonExpenses.filter((e) => e.user_id === userId)
    const pendingPayments = expenses.filter((e) => e.status === "pending").length
    const totalPaid = expenses.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.amount, 0)
    const visitors = mockVisitors.filter((v) => v.user_id === userId).length

    return { pendingPayments, totalPaid, visitors }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Residentes</h2>
          <p className="text-muted-foreground">Administra la información de los residentes del edificio</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Agregar Residente
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Buscar Residentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, departamento o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Residentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residents.length}</div>
            <p className="text-xs text-muted-foreground">Departamentos ocupados</p>
          </CardContent>
        </Card>
      </div>

      {/* Residents List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Residentes</CardTitle>
          <CardDescription>
            {filteredResidents.length}{" "}
            {filteredResidents.length === 1 ? "residente encontrado" : "residentes encontrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResidents.map((resident) => {
              const stats = getResidentStats(resident.id)

              return (
                <div key={resident.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          <AvatarInitials name={resident.name} />
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium text-lg">{resident.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Home className="w-4 h-4" />
                              <span>Depto. {resident.apartment}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span>{resident.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{resident.phone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Resident Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            {stats.pendingPayments > 0 ? (
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            <div>
                              <p className="text-xs text-muted-foreground">Pagos Pendientes</p>
                              <p className="text-sm font-medium">{stats.pendingPayments}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">Total Pagado</p>
                            <p className="text-sm font-medium">{formatCurrency(stats.totalPaid)}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">Visitas Registradas</p>
                            <p className="text-sm font-medium">{stats.visitors}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={stats.pendingPayments > 0 ? "destructive" : "default"}>
                        {stats.pendingPayments > 0 ? "Pagos Pendientes" : "Al Día"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
