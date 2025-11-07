"use client"

import { useState } from "react"
import { mockAnnouncements } from "@/lib/mock-data"
import type { Announcement } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Pin, Trash2 } from "lucide-react"

export function AdminAnnouncementManagement() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "general" as Announcement["type"],
    priority: "medium" as Announcement["priority"],
  })

  const handleCreateAnnouncement = () => {
    const announcement: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      building_id: "1",
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      type: newAnnouncement.type,
      priority: newAnnouncement.priority,
      author_id: "1", // Admin user
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement({
      title: "",
      content: "",
      type: "general",
      priority: "medium",
    })
    setIsCreateModalOpen(false)
  }

  const togglePin = (id: string) => {
    setAnnouncements(announcements.map((ann) => (ann.id === id ? { ...ann, is_pinned: !ann.is_pinned } : ann)))
  }

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "maintenance":
        return "bg-orange-100 text-orange-800"
      case "emergency":
        return "bg-red-100 text-red-800"
      case "event":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Comunicados</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Comunicado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Comunicado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Título del comunicado"
                />
              </div>
              <div>
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Contenido del comunicado"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={newAnnouncement.type}
                  onValueChange={(value: Announcement["type"]) =>
                    setNewAnnouncement({ ...newAnnouncement, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="maintenance">Mantención</SelectItem>
                    <SelectItem value="emergency">Emergencia</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={newAnnouncement.priority}
                  onValueChange={(value: Announcement["priority"]) =>
                    setNewAnnouncement({ ...newAnnouncement, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateAnnouncement} className="w-full">
                Crear Comunicado
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className={announcement.is_pinned ? "border-primary" : ""}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    {announcement.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(announcement.priority)}>
                      {announcement.priority === "high"
                        ? "Alta"
                        : announcement.priority === "medium"
                          ? "Media"
                          : "Baja"}
                    </Badge>
                    <Badge className={getTypeColor(announcement.type)}>
                      {announcement.type === "general"
                        ? "General"
                        : announcement.type === "maintenance"
                          ? "Mantención"
                          : announcement.type === "emergency"
                            ? "Emergencia"
                            : "Evento"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => togglePin(announcement.id)}>
                    <Pin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteAnnouncement(announcement.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(announcement.created_at).toLocaleDateString("es-CL")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
