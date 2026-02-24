import { useState } from "react";
import { Plus, Search, Wrench, AlertTriangle, CheckCircle, MoreHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Hammer } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  category: string;
  status: "disponivel" | "em_uso" | "manutencao" | "precisando";
  quantity: number;
  notes: string;
}

const categories = ["Ferramentas Elétricas", "Ferramentas Manuais", "Equipamentos de Segurança", "Medição", "Outros"];

const statusLabels = {
  disponivel: { label: "Disponível", class: "bg-success/10 text-success", icon: CheckCircle },
  em_uso: { label: "Em Uso", class: "bg-accent/10 text-accent", icon: Wrench },
  manutencao: { label: "Manutenção", class: "bg-warning/10 text-warning", icon: AlertTriangle },
  precisando: { label: "Precisando", class: "bg-destructive/10 text-destructive", icon: AlertTriangle },
};

const mockTools: Tool[] = [
  { id: "1", name: "Furadeira Bosch", category: "Ferramentas Elétricas", status: "disponivel", quantity: 2, notes: "" },
  { id: "2", name: "Serra Circular", category: "Ferramentas Elétricas", status: "em_uso", quantity: 1, notes: "Com João na obra" },
  { id: "3", name: "Trena Laser", category: "Medição", status: "disponivel", quantity: 1, notes: "" },
  { id: "4", name: "Nível a Laser", category: "Medição", status: "manutencao", quantity: 1, notes: "Bateria com defeito" },
  { id: "5", name: "Martelo Demolidor", category: "Ferramentas Elétricas", status: "precisando", quantity: 0, notes: "Necessário para próxima obra" },
  { id: "6", name: "Capacetes", category: "Equipamentos de Segurança", status: "disponivel", quantity: 5, notes: "" },
];

const Ferramentas = () => {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTool, setNewTool] = useState({
    name: "",
    category: "",
    status: "disponivel" as Tool["status"],
    quantity: 1,
    notes: "",
  });

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || tool.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddTool = () => {
    const tool: Tool = {
      id: Date.now().toString(),
      ...newTool,
    };
    setTools([tool, ...tools]);
    setNewTool({ name: "", category: "", status: "disponivel", quantity: 1, notes: "" });
    setIsDialogOpen(false);
  };

  const needingCount = tools.filter(t => t.status === "precisando").length;
  const maintenanceCount = tools.filter(t => t.status === "manutencao").length;

  return (
    <AppLayout>
      <PageHeader title="Ferramentas" description="Controle de ferramentas e utensílios">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ferramenta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Cadastrar Ferramenta</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome *</Label>
                <Input
                  value={newTool.name}
                  onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                  placeholder="Nome da ferramenta"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select
                    value={newTool.category}
                    onValueChange={(value) => setNewTool({ ...newTool, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={newTool.status}
                    onValueChange={(value) => setNewTool({ ...newTool, status: value as Tool["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  min="0"
                  value={newTool.quantity}
                  onChange={(e) => setNewTool({ ...newTool, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Observações</Label>
                <Input
                  value={newTool.notes}
                  onChange={(e) => setNewTool({ ...newTool, notes: e.target.value })}
                  placeholder="Notas adicionais"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTool} disabled={!newTool.name}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Alerts */}
      {(needingCount > 0 || maintenanceCount > 0) && (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {needingCount > 0 && (
            <Card className="border-destructive/50 bg-destructive/5 animate-fade-in">
              <CardContent className="flex items-center gap-4 pt-6">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="font-semibold">Ferramentas Necessárias</p>
                  <p className="text-sm text-muted-foreground">{needingCount} item(s) precisando ser adquirido(s)</p>
                </div>
              </CardContent>
            </Card>
          )}
          {maintenanceCount > 0 && (
            <Card className="border-warning/50 bg-warning/5 animate-fade-in">
              <CardContent className="flex items-center gap-4 pt-6">
                <Wrench className="h-8 w-8 text-warning" />
                <div>
                  <p className="font-semibold">Em Manutenção</p>
                  <p className="text-sm text-muted-foreground">{maintenanceCount} item(s) em manutenção</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ferramenta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            {Object.entries(statusLabels).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hammer className="h-5 w-5 text-accent" />
            Lista de Ferramentas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ferramenta</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.map((tool) => {
                const StatusIcon = statusLabels[tool.status].icon;
                return (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell className="text-center">{tool.quantity}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusLabels[tool.status].class}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusLabels[tool.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{tool.notes || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Ferramentas;
