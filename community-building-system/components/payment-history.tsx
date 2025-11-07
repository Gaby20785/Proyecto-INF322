"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, AlertCircle, Download, Search, Filter } from "lucide-react"
import type { CommonExpense } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface PaymentHistoryProps {
  expenses: CommonExpense[]
  onPayExpense: (expense: CommonExpense) => void
}

export function PaymentHistory({ expenses, onPayExpense }: PaymentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")

  // Filtrar gastos
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.month.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter
    const matchesYear = yearFilter === "all" || expense.year.toString() === yearFilter

    return matchesSearch && matchesStatus && matchesYear
  })

  // Obtener años únicos para el filtro
  const availableYears = [...new Set(expenses.map((expense) => expense.year))].sort((a, b) => b - a)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            Pagado
          </Badge>
        )
      case "overdue":
        return <Badge variant="destructive">Vencido</Badge>
      default:
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  const downloadReceipt = (expense: CommonExpense) => {
    // Simular descarga de comprobante
    const element = document.createElement("a")
    const file = new Blob(
      [
        `Comprobante de pago - ${expense.description}\nMonto: ${formatCurrency(expense.amount)}\nFecha: ${expense.paid_date || "Pendiente"}`,
      ],
      { type: "text/plain" },
    )
    element.href = URL.createObjectURL(file)
    element.download = `comprobante-${expense.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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
                  placeholder="Buscar por descripción o mes..."
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
                  <SelectItem value="paid">Pagado</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Año</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los años</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Gastos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Gastos Comunes</CardTitle>
          <CardDescription>
            {filteredExpenses.length} {filteredExpenses.length === 1 ? "gasto encontrado" : "gastos encontrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-8">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron gastos</h3>
                <p className="text-muted-foreground">Intenta ajustar los filtros para ver más resultados</p>
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{getStatusIcon(expense.status)}</div>
                    <div className="space-y-1">
                      <h4 className="font-medium">{expense.description}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Vencimiento: {new Date(expense.due_date).toLocaleDateString("es-CL")}</span>
                        {expense.paid_date && (
                          <span className="text-green-600">
                            Pagado: {new Date(expense.paid_date).toLocaleDateString("es-CL")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(expense.amount)}</p>
                      {getStatusBadge(expense.status)}
                    </div>

                    <div className="flex gap-2">
                      {expense.status === "paid" ? (
                        <Button variant="outline" size="sm" onClick={() => downloadReceipt(expense)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => onPayExpense(expense)}>
                          Pagar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
