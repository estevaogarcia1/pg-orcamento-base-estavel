import { useState } from "react";
import { Plus, Search, Phone, Mail, Award, MoreHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { UserCheck } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  type: "engenheiro" | "arquiteto";
  registration: string;
  phone: string;
  email: string;
  specialty: string;
}

const mockProfessionals: Professional[] = [
  { id: "1", name: "Eng. Carlos Alberto", type: "engenheiro", registration: "CREA 123456", phone: "(51) 99999-1111", email: "carlos@engenharia.com", specialty: "Estruturas" },
  { id: "2", name: "Arq. Marina Costa", type: "arquiteto", registration: "CAU A123456", phone: "(51) 99999-2222", email: "marina@arquitetura.com", specialty: "Interiores" },
];

const Profissionais = () => {
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProfessional, setNewProfessional] = useState({
    name: "",
    type: "" as "engenheiro" | "arquiteto" | "",
    registration: "",
    phone: "",
    email: "",
    specialty: "",
  });

  const filteredProfessionals = professionals.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProfessional = () => {
    if (!newProfessional.type) return;
    const professional: Professional = {
      id: Date.now().toString(),
      ...newProfessional,
      type: newProfessional.type as "engenheiro" | "arquiteto",
    };
    setProfessionals([professional, ...professionals]);
    setNewProfessional({ name: "", type: "", registration: "", phone: "", email: "", specialty: "" });
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <PageHeader title="Profissionais" description="Cadastre engenheiros e arquitetos parceiros">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Cadastrar Profissional</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome Completo *</Label>
                <Input
                  value={newProfessional.name}
                  onChange={(e) => setNewProfessional({ ...newProfessional, name: e.target.value })}
                  placeholder="Nome do profissional"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo *</Label>
                  <Select
                    value={newProfessional.type}
                    onValueChange={(value) => setNewProfessional({ ...newProfessional, type: value as "engenheiro" | "arquiteto" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engenheiro">Engenheiro</SelectItem>
                      <SelectItem value="arquiteto">Arquiteto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Registro (CREA/CAU)</Label>
                  <Input
                    value={newProfessional.registration}
                    onChange={(e) => setNewProfessional({ ...newProfessional, registration: e.target.value })}
                    placeholder="CREA/CAU número"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Telefone</Label>
                  <Input
                    value={newProfessional.phone}
                    onChange={(e) => setNewProfessional({ ...newProfessional, phone: e.target.value })}
                    placeholder="(51) 99999-9999"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={newProfessional.email}
                    onChange={(e) => setNewProfessional({ ...newProfessional, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Especialidade</Label>
                <Input
                  value={newProfessional.specialty}
                  onChange={(e) => setNewProfessional({ ...newProfessional, specialty: e.target.value })}
                  placeholder="Ex: Estruturas, Interiores, etc."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddProfessional} disabled={!newProfessional.name || !newProfessional.type}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar profissional..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Professionals Grid */}
      {filteredProfessionals.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="Nenhum profissional cadastrado"
          description="Cadastre engenheiros e arquitetos parceiros."
          actionLabel="Cadastrar Profissional"
          onAction={() => setIsDialogOpen(true)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="transition-all hover:shadow-lg animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      professional.type === "engenheiro" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                    }`}>
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{professional.name}</h3>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        professional.type === "engenheiro" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                      }`}>
                        {professional.type === "engenheiro" ? "Engenheiro" : "Arquiteto"}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{professional.registration}</p>
                  {professional.specialty && (
                    <p className="text-muted-foreground">Especialidade: {professional.specialty}</p>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{professional.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{professional.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Profissionais;
