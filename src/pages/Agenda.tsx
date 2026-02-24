import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, Clock, MapPin, User, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  title: string;
  client: string;
  type: "visita" | "orcamento" | "entrega" | "reuniao";
  date: string;
  time: string;
  address: string;
  notes: string;
}

const typeLabels = {
  visita: { label: "Visita Técnica", color: "bg-primary/10 text-primary" },
  orcamento: { label: "Orçamento", color: "bg-accent/10 text-accent" },
  entrega: { label: "Entrega", color: "bg-success/10 text-success" },
  reuniao: { label: "Reunião", color: "bg-warning/10 text-warning" },
};

const STORAGE_KEY = "pg-appointments-data";

const defaultAppointments: Appointment[] = [
  { id: "1", title: "Visita técnica - Medições", client: "João Silva", type: "visita", date: "2024-01-24", time: "14:00", address: "Rua das Flores, 123", notes: "Levar trena e câmera" },
  { id: "2", title: "Entrega de orçamento", client: "Maria Santos", type: "orcamento", date: "2024-01-25", time: "09:30", address: "Av. Brasil, 456", notes: "" },
  { id: "3", title: "Entrega final da obra", client: "Carlos Oliveira", type: "entrega", date: "2024-01-26", time: "10:00", address: "Rua do Comércio, 789", notes: "Checklist de entrega" },
];

const loadAppointments = (): Appointment[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading appointments:", error);
  }
  return defaultAppointments;
};

const saveAppointments = (appointments: Appointment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch (error) {
    console.error("Error saving appointments:", error);
  }
};

const getEmptyForm = (): Omit<Appointment, "id"> => ({
  title: "",
  client: "",
  type: "visita",
  date: "",
  time: "",
  address: "",
  notes: "",
});

const Agenda = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(loadAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Appointment, "id">>(getEmptyForm());

  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const todayAppointments = appointments.filter(
    (apt) => apt.date === getTodayString()
  );

  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) >= new Date(getTodayString()))
    .sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

  const selectedDateAppointments = selectedDate
    ? appointments.filter(
        (apt) => apt.date === selectedDate.toISOString().split("T")[0]
      )
    : [];

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        title: appointment.title,
        client: appointment.client,
        type: appointment.type,
        date: appointment.date,
        time: appointment.time,
        address: appointment.address,
        notes: appointment.notes,
      });
    } else {
      setEditingAppointment(null);
      setFormData(getEmptyForm());
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAppointment(null);
    setFormData(getEmptyForm());
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.date) {
      toast({
        title: "Erro",
        description: "A data é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.time) {
      toast({
        title: "Erro",
        description: "O horário é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (editingAppointment) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === editingAppointment.id
            ? { ...formData, id: editingAppointment.id }
            : apt
        )
      );
      toast({
        title: "Sucesso",
        description: "Agendamento atualizado com sucesso!",
      });
    } else {
      const newAppointment: Appointment = {
        ...formData,
        id: Date.now().toString(),
      };
      setAppointments((prev) => [...prev, newAppointment]);
      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso!",
      });
    }

    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setAppointmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentToDelete));
      toast({
        title: "Sucesso",
        description: "Agendamento excluído com sucesso!",
      });
    }
    setDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  const appointmentDates = appointments.map((apt) => new Date(apt.date + "T00:00:00"));

  return (
    <AppLayout>
      <PageHeader title="Agenda" description="Gerencie visitas técnicas e compromissos">
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Título *</Label>
                <Input
                  placeholder="Ex: Visita técnica para medições"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Appointment["type"]) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeLabels).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Cliente</Label>
                  <Input
                    placeholder="Nome do cliente"
                    value={formData.client}
                    onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Horário *</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Endereço</Label>
                <Input
                  placeholder="Endereço do compromisso"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Observações</Label>
                <Textarea
                  placeholder="Anotações adicionais..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-accent" />
              Calendário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasAppointment: appointmentDates,
              }}
              modifiersStyles={{
                hasAppointment: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                },
              }}
            />
            {selectedDate && selectedDateAppointments.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">
                  {selectedDate.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedDateAppointments.length} compromisso(s)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  Nenhum compromisso para hoje
                </p>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onEdit={() => handleOpenDialog(apt)}
                      onDelete={() => handleDeleteClick(apt.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Próximos Compromissos</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  Nenhum compromisso futuro
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onEdit={() => handleOpenDialog(apt)}
                      onDelete={() => handleDeleteClick(apt.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: () => void;
  onDelete: () => void;
}

function AppointmentCard({ appointment, onEdit, onDelete }: AppointmentCardProps) {
  const type = typeLabels[appointment.type];

  return (
    <div className="flex items-start justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
      <div className="flex gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">
            {new Date(appointment.date + "T00:00:00").getDate()}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(appointment.date + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" })}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${type.color}`}>
              {type.label}
            </span>
          </div>
          <h4 className="font-medium">{appointment.title}</h4>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            {appointment.client && (
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                <span>{appointment.client}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>{appointment.time}</span>
            </div>
            {appointment.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>{appointment.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Agenda;
