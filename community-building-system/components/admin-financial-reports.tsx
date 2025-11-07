"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Download, Calendar, CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { mockCommonExpenses, mockUsers } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"

export function AdminFinancialReports() {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Calcular estadísticas financieras
  const totalRevenue = mockCommonExpenses
    .filter((e) => e.status === "paid")
    .reduce((sum, expense) => sum + expense.amount, 0)

  const pendingRevenue = mockCommonExpenses
    .filter((e) => e.status === "pending")
    .reduce((sum, expense) => sum + expense.amount, 0)

  const overdueRevenue = mockCommonExpenses
    .filter((e) => e.status === "overdue")
    .reduce((sum, expense) => sum + expense.amount, 0)

  const collectionRate = (totalRevenue / (totalRevenue + pendingRevenue + overdueRevenue)) * 100

  const residents = mockUsers.filter((u) => u.role === "resident")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reportes Financieros</h2>
          <p className="text-muted-foreground">Análisis financiero y estado de pagos del edificio</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Financial KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              +8.2% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {mockCommonExpenses.filter((e) => e.status === "pending").length} pagos pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Cobranza</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Eficiencia de cobranza</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Morosidad</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overdueRevenue)}</div>
            <p className="text-xs text-muted-foreground">Pagos vencidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Pagos por Residente</CardTitle>
            <CardDescription>Resumen del estado de pagos de cada departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {residents.map((resident) => {
                const userExpenses = mockCommonExpenses.filter((e) => e.user_id === resident.id)
                const pendingCount = userExpenses.filter((e) => e.status === "pending").length
                const paidCount = userExpenses.filter((e) => e.status === "paid").length
                const totalPaid = userExpenses.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.amount, 0)

                return (
                  <div key={resident.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {pendingCount > 0 ? (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{resident.name}</p>
                        <p className="text-sm text-muted-foreground">Depto. {resident.apartment}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(totalPaid)}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={pendingCount > 0 ? "destructive" : "default"}>
                          {pendingCount > 0 ? `${pendingCount} pendiente${pendingCount > 1 ? "s" : ""}` : "Al día"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen Mensual</CardTitle>
            <CardDescription>Análisis financiero del mes actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Pagos Recibidos</span>
                </div>
                <span className="font-bold text-green-700">{formatCurrency(totalRevenue)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">Pagos Pendientes</span>
                </div>
                <span className="font-bold text-yellow-700">{formatCurrency(pendingRevenue)}</span>
              </div>

              {overdueRevenue > 0 && (
                <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Pagos Vencidos</span>
                  </div>
                  <span className="font-bold text-red-700">{formatCurrency(overdueRevenue)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Esperado</span>
                <span className="text-lg font-bold">
                  {formatCurrency(totalRevenue + pendingRevenue + overdueRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Tasa de cobranza</span>
                <span>{collectionRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Gastos Comunes</CardTitle>
          <CardDescription>Listado completo de gastos comunes del mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCommonExpenses.map((expense) => {
              const resident = residents.find((r) => r.id === expense.user_id)

              return (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {expense.status === "paid" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : expense.status === "overdue" ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Calendar className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {resident?.name} - Depto. {resident?.apartment}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Vencimiento: {new Date(expense.due_date).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(expense.amount)}</p>
                    <Badge
                      variant={
                        expense.status === "paid"
                          ? "default"
                          : expense.status === "overdue"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {expense.status === "paid" ? "Pagado" : expense.status === "overdue" ? "Vencido" : "Pendiente"}
                    </Badge>
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
