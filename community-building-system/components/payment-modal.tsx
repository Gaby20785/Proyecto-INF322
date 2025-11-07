"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Building, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import type { CommonExpense } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface PaymentModalProps {
  expense: CommonExpense | null
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (expenseId: string) => void
}

export function PaymentModal({ expense, isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit" | "transfer">("credit")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  if (!expense) return null

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setPaymentComplete(true)

    // Simular éxito del pago después de 2 segundos
    setTimeout(() => {
      onPaymentSuccess(expense.id)
      setPaymentComplete(false)
      onClose()
      // Reset form
      setCardNumber("")
      setExpiryDate("")
      setCvv("")
      setCardName("")
    }, 2000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  if (paymentComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">¡Pago Exitoso!</h3>
            <p className="text-muted-foreground mb-4">
              Tu pago de {formatCurrency(expense.amount)} ha sido procesado correctamente.
            </p>
            <p className="text-sm text-muted-foreground">Recibirás un comprobante por correo electrónico.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Pagar Gastos Comunes
          </DialogTitle>
          <DialogDescription>Completa la información para procesar tu pago</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumen del Pago */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen del Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Descripción:</span>
                <span className="font-medium">{expense.description}</span>
              </div>
              <div className="flex justify-between">
                <span>Período:</span>
                <span className="font-medium">
                  {expense.month} {expense.year}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fecha de vencimiento:</span>
                <span className="font-medium">{new Date(expense.due_date).toLocaleDateString("es-CL")}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total a pagar:</span>
                <span>{formatCurrency(expense.amount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Método de Pago */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Método de Pago</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant={paymentMethod === "credit" ? "default" : "outline"}
                onClick={() => setPaymentMethod("credit")}
                className="h-auto p-4 flex flex-col gap-2"
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">Tarjeta de Crédito</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "debit" ? "default" : "outline"}
                onClick={() => setPaymentMethod("debit")}
                className="h-auto p-4 flex flex-col gap-2"
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">Tarjeta de Débito</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "transfer" ? "default" : "outline"}
                onClick={() => setPaymentMethod("transfer")}
                className="h-auto p-4 flex flex-col gap-2"
              >
                <Building className="w-6 h-6" />
                <span className="text-sm">Transferencia</span>
              </Button>
            </div>
          </div>

          {/* Formulario de Pago */}
          {paymentMethod !== "transfer" ? (
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nombre del titular</Label>
                  <Input
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Nombre como aparece en la tarjeta"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número de tarjeta</Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Fecha de vencimiento</Label>
                    <Input
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Tu información está protegida con encriptación SSL de 256 bits.</AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isProcessing} className="flex-1">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    `Pagar ${formatCurrency(expense.amount)}`
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transferencia Bancaria</CardTitle>
                <CardDescription>Realiza la transferencia a la siguiente cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Banco:</span>
                    <p>Banco de Chile</p>
                  </div>
                  <div>
                    <span className="font-medium">Tipo de cuenta:</span>
                    <p>Cuenta Corriente</p>
                  </div>
                  <div>
                    <span className="font-medium">Número de cuenta:</span>
                    <p>123-45678-90</p>
                  </div>
                  <div>
                    <span className="font-medium">RUT:</span>
                    <p>76.123.456-7</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <span className="font-medium text-sm">Titular:</span>
                  <p className="text-sm">Administradora ProComunidad Ltda.</p>
                </div>
                <div className="space-y-2">
                  <span className="font-medium text-sm">Monto a transferir:</span>
                  <p className="text-lg font-bold">{formatCurrency(expense.amount)}</p>
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Recuerda incluir tu número de departamento en el comentario de la transferencia.
                  </AlertDescription>
                </Alert>
                <Button onClick={onClose} className="w-full">
                  Entendido
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
