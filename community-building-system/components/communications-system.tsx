"use client"

import { useState } from "react"
import { mockAnnouncements } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, Pin, AlertCircle, Wrench } from "lucide-react"

interface Message {
  id: string
  sender_id: string
  sender_name: string
  sender_type: "resident" | "admin"
  subject: string
  content: string
  category: "general" | "maintenance" | "complaint" | "suggestion"
  status: "open" | "in_progress" | "resolved" | "closed"
  created_at: string
  responses?: {
    id: string
    sender_name: string
    sender_type: "resident" | "admin"
    content: string
    created_at: string
  }[]
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender_id: "2",
    sender_name: "María González",
    sender_type: "resident",
    subject: "Problema con ascensor",
    content: "El ascensor del lado derecho ha estado haciendo ruidos extraños y se detiene bruscamente.",
    category: "maintenance",
    status: "in_progress",
    created_at: "2024-01-15T10:30:00Z",
    responses: [
      {
        id: "1",
        sender_name: "Admin Edificio",
        sender_type: "admin",
        content: "Hemos contactado al técnico especialista. Revisión programada para mañana.",
        created_at: "2024-01-15T14:20:00Z",
      },
    ],
  },
  {
    id: "2",
    sender_id: "3",
    sender_name: "Carlos Rodríguez",
    sender_type: "resident",
    subject: "Sugerencia para área común",
    content: "Sería bueno instalar más bancos en el jardín para que los adultos mayores puedan descansar.",
    category: "suggestion",
    status: "open",
    created_at: "2024-01-14T16:45:00Z",
  },
]

export function CommunicationsSystem({ userType = "resident" }: { userType?: "resident" | "admin" }) {
  const [announcements] = useState(mockAnnouncements)
  const [messages, setMessages] = useState(mockMessages)
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: "",
    category: "general" as Message["category"],
  })
  const [newResponse, setNewResponse] = useState("")

  const handleSendMessage = () => {
    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender_id: "2",
      sender_name: userType === "admin" ? "Admin Edificio" : "Usuario Residente",
      sender_type: userType,
      subject: newMessage.subject,
      content: newMessage.content,
      category: newMessage.category,
      status: "open",
      created_at: new Date().toISOString(),
      responses: [],
    }

    setMessages([message, ...messages])
    setNewMessage({ subject: "", content: "", category: "general" })
    setIsNewMessageOpen(false)
  }

  const handleSendResponse = () => {
    if (!selectedMessage || !newResponse.trim()) return

    const response = {
      id: Math.random().toString(36).substr(2, 9),
      sender_name: userType === "admin" ? "Admin Edificio" : "Usuario Residente",
      sender_type: userType,
      content: newResponse,
      created_at: new Date().toISOString(),
    }

    setMessages(
      messages.map((msg) =>
        msg.id === selectedMessage.id ? { ...msg, responses: [...(msg.responses || []), response] } : msg,
      ),
    )

    setNewResponse("")
  }

  const updateMessageStatus = (messageId: string, status: Message["status"]) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, status } : msg)))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "complaint":
        return <AlertCircle className="h-4 w-4" />
      case "suggestion":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcements">Comunicados</TabsTrigger>
          <TabsTrigger value="messages">Mensajes</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Comunicados del Edificio</h3>
          </div>

          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className={announcement.is_pinned ? "border-primary" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{announcement.title}</CardTitle>
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
                        <Badge variant="outline">
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
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Centro de Mensajes</h3>
            <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Nuevo Mensaje
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Enviar Nuevo Mensaje</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Asunto</Label>
                    <Input
                      id="subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                      placeholder="Asunto del mensaje"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={newMessage.category}
                      onValueChange={(value: Message["category"]) => setNewMessage({ ...newMessage, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="maintenance">Mantención</SelectItem>
                        <SelectItem value="complaint">Reclamo</SelectItem>
                        <SelectItem value="suggestion">Sugerencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Mensaje</Label>
                    <Textarea
                      id="content"
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                      placeholder="Describe tu consulta o solicitud"
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSendMessage} className="w-full">
                    Enviar Mensaje
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {messages.map((message) => (
              <Card key={message.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(message.category)}
                        <CardTitle className="text-base">{message.subject}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(message.status)}>
                          {message.status === "open"
                            ? "Abierto"
                            : message.status === "in_progress"
                              ? "En Progreso"
                              : message.status === "resolved"
                                ? "Resuelto"
                                : "Cerrado"}
                        </Badge>
                        <Badge variant="outline">
                          {message.category === "general"
                            ? "General"
                            : message.category === "maintenance"
                              ? "Mantención"
                              : message.category === "complaint"
                                ? "Reclamo"
                                : "Sugerencia"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Por: {message.sender_name} • {new Date(message.created_at).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                    {userType === "admin" && (
                      <Select
                        value={message.status}
                        onValueChange={(value: Message["status"]) => updateMessageStatus(message.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Abierto</SelectItem>
                          <SelectItem value="in_progress">En Progreso</SelectItem>
                          <SelectItem value="resolved">Resuelto</SelectItem>
                          <SelectItem value="closed">Cerrado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{message.content}</p>

                  {message.responses && message.responses.length > 0 && (
                    <div className="space-y-3 border-t pt-3">
                      <h4 className="text-sm font-medium">Respuestas:</h4>
                      {message.responses.map((response) => (
                        <div key={response.id} className="bg-muted p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium">{response.sender_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(response.created_at).toLocaleDateString("es-CL")}
                            </span>
                          </div>
                          <p className="text-sm">{response.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Escribir respuesta..."
                      value={selectedMessage?.id === message.id ? newResponse : ""}
                      onChange={(e) => {
                        setSelectedMessage(message)
                        setNewResponse(e.target.value)
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          setSelectedMessage(message)
                          handleSendResponse()
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedMessage(message)
                        handleSendResponse()
                      }}
                      disabled={!newResponse.trim() || selectedMessage?.id !== message.id}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
