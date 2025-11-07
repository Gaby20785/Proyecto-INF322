"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Calendar, Edit3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvailabilityCalendarProps {
  selectedDate?: string
  onDateSelect: (date: string) => void
  minDate?: Date
  maxDate?: Date
  disabledDays?: number[] // 0 = domingo, 1 = lunes, etc.
  className?: string
}

export function AvailabilityCalendar({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  maxDate,
  disabledDays = [],
  className,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [manualDate, setManualDate] = useState("")
  const [dateInputError, setDateInputError] = useState("")

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const validateAndParseDate = (dateString: string): Date | null => {
    const cleaned = dateString.replace(/[^\d/]/g, "")

    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/
    const match = cleaned.match(dateRegex)

    if (!match) return null

    let [, day, month, year] = match

    if (year.length === 2) {
      const currentYear = new Date().getFullYear()
      const currentCentury = Math.floor(currentYear / 100) * 100
      const yearNum = Number.parseInt(year)
      year = (yearNum + currentCentury).toString()
    }

    const dayNum = Number.parseInt(day)
    const monthNum = Number.parseInt(month)
    const yearNum = Number.parseInt(year)

    if (dayNum < 1 || dayNum > 31) return null
    if (monthNum < 1 || monthNum > 12) return null
    if (yearNum < 1900 || yearNum > 2100) return null

    const date = new Date(yearNum, monthNum - 1, dayNum)

    if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
      return null
    }

    return date
  }

  const handleManualDateChange = (value: string) => {
    setManualDate(value)
    setDateInputError("")

    if (value.length === 0) return

    const parsedDate = validateAndParseDate(value)

    if (!parsedDate) {
      setDateInputError("Formato inválido. Use dd/mm/yyyy")
      return
    }

    const today = new Date()
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const parsedLocal = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate())

    if (parsedLocal < todayLocal) {
      setDateInputError("No se pueden seleccionar fechas pasadas")
      return
    }

    if (minDate) {
      const minLocal = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
      if (parsedLocal < minLocal) {
        setDateInputError("Fecha anterior al mínimo permitido")
        return
      }
    }

    if (maxDate) {
      const maxLocal = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
      if (parsedLocal > maxLocal) {
        setDateInputError("Fecha posterior al máximo permitido")
        return
      }
    }

    if (disabledDays.includes(parsedDate.getDay())) {
      setDateInputError("Día de la semana no disponible")
      return
    }

    const dateString = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`
    onDateSelect(dateString)

    setCurrentMonth(new Date(parsedDate.getFullYear(), parsedDate.getMonth()))
  }

  const formatDateForInput = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number)
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`
  }

  const handleCalendarDateSelect = (dateString: string) => {
    onDateSelect(dateString)
    setManualDate(formatDateForInput(dateString))
    setDateInputError("")
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dateString: `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}-${String(prevDate.getDate()).padStart(2, "0")}`,
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day)
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        dateString: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`,
      })
    }

    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day)
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dateString: `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(nextDate.getDate()).padStart(2, "0")}`,
      })
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)

  const isDateDisabled = (date: Date, dateString: string) => {
    const today = new Date()
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const dateLocal = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (dateLocal < todayLocal) return true

    if (minDate) {
      const minLocal = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
      if (dateLocal < minLocal) return true
    }

    if (maxDate) {
      const maxLocal = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
      if (dateLocal > maxLocal) return true
    }

    if (disabledDays.includes(date.getDay())) return true

    return false
  }

  const formatDateForDisplay = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Seleccionar Fecha
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="manual-date" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Escribir fecha manualmente
          </Label>
          <Input
            id="manual-date"
            type="text"
            placeholder="dd/mm/yyyy"
            value={manualDate}
            onChange={(e) => handleManualDateChange(e.target.value)}
            className={cn(dateInputError && "border-red-500")}
          />
          {dateInputError && <p className="text-sm text-red-500">{dateInputError}</p>}
          <p className="text-xs text-muted-foreground">Formato: día/mes/año (ejemplo: 25/12/2024)</p>
        </div>

        {selectedDate && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium">Fecha seleccionada:</p>
            <p className="text-lg font-semibold">{formatDateForDisplay(selectedDate)}</p>
          </div>
        )}

        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const isDisabled = isDateDisabled(day.date, day.dateString)
            const isSelected = selectedDate === day.dateString
            const isToday = day.dateString === todayString

            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                disabled={isDisabled || !day.isCurrentMonth}
                onClick={() => day.isCurrentMonth && !isDisabled && handleCalendarDateSelect(day.dateString)}
                className={cn(
                  "h-12 p-1 flex flex-col items-center justify-center relative",
                  !day.isCurrentMonth && "text-muted-foreground opacity-50",
                  isSelected && "bg-primary text-primary-foreground",
                  isToday && !isSelected && "ring-2 ring-primary ring-offset-1",
                  isDisabled && "opacity-30 cursor-not-allowed",
                )}
              >
                <span className="text-sm font-medium">{day.date.getDate()}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
