import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, FileText, Download, Send, MoreHorizontal, Eye, Edit2, Trash2, CheckCircle, XCircle, Clock, PlayCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";

interface Budget {
  id: string;
  number: string;
  client: string;
  project: string;
  value: number;
  status: "rascunho" | "enviado" | "aprovado" | "recusado" | "em_andamento" | "concluido";
  createdAt: string;
  validUntil: string;
}

const statusLabels = {
  rascunho: { label: "Rascunho", class: "bg-muted text-muted-foreground" },
  enviado: { label: "Enviado", class: "bg-primary/10 text-primary" },
  aprovado: { label: "Aprovado", class: "bg-success/10 text-success" },
  recusado: { label: "Recusado", class: "bg-destructive/10 text-destructive" },
  em_andamento: { label: "Em Andamento", class: "bg-accent/10 text-accent" },
  concluido: { label: "Concluído", class: "bg-success/10 text-success" },
};

const mockBudgets: Budget[] = [
  { id: "1", number: "ORC-2024-001", client: "João Silva", project: "Reforma Cozinha Completa", value: 15800, status: "aprovado", createdAt: "2024-01-15", validUntil: "2024-02-15" },
  { id: "2", number: "ORC-2024-002", client: "Maria Santos", project: "Banheiro Suíte Master", value: 8500, status: "enviado", createdAt: "2024-01-18", validUntil: "2024-02-18" },
  { id: "3", number: "ORC-2024-003", client: "Carlos Oliveira", project: "Reforma Sala Comercial", value: 45000, status: "em_andamento", createdAt: "2024-01-10", validUntil: "2024-02-10" },
  { id: "4", number: "ORC-2024-004", client: "Ana Paula Lima", project: "Pintura Apartamento", value: 4200, status: "rascunho", createdAt: "2024-01-20", validUntil: "2024-02-20" },
  { id: "5", number: "ORC-2024-005", client: "Roberto Costa", project: "Troca de Piso - 3 Quartos", value: 12600, status: "concluido", createdAt: "2024-01-05", validUntil: "2024-02-05" },
];

const BUDGETS_STORAGE_KEY = "pg-budgets-data";

const loadBudgets = (): Budget[] => {
  const saved = localStorage.getItem(BUDGETS_STORAGE_KEY);
  return saved ? JSON.parse(saved) : mockBudgets;
};

const Orcamentos = () => {
   const [budgets, setBudgets] = useState<Budget[]>(loadBudgets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

   const saveBudgets = (newBudgets: Budget[]) => {
     setBudgets(newBudgets);
     localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(newBudgets));
   };

   const handleStatusChange = (budgetId: string, newStatus: Budget["status"]) => {
     const updated = budgets.map((b) =>
       b.id === budgetId ? { ...b, status: newStatus } : b
     );
     saveBudgets(updated);
     toast.success(`Status alterado para "${statusLabels[newStatus].label}"`);
   };

   const handleDeleteClick = (budget: Budget) => {
     setBudgetToDelete(budget);
     setDeleteDialogOpen(true);
   };

   const handleConfirmDelete = () => {
     if (budgetToDelete) {
       const updated = budgets.filter((b) => b.id !== budgetToDelete.id);
       saveBudgets(updated);
       toast.success("Orçamento excluído com sucesso");
       setBudgetToDelete(null);
     }
     setDeleteDialogOpen(false);
   };

  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch =
      budget.client.toLowerCase().includes(search.toLowerCase()) ||
      budget.project.toLowerCase().includes(search.toLowerCase()) ||
      budget.number.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || budget.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const totalValue = filteredBudgets.reduce((acc, b) => acc + b.value, 0);

  return (
    <AppLayout>
      <PageHeader title="Orçamentos" description="Gerencie todos os orçamentos da empresa">
        <Button asChild>
          <Link to="/orcamentos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Link>
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          { label: "Total", value: budgets.length, color: "text-foreground" },
          { label: "Aprovados", value: budgets.filter(b => b.status === "aprovado").length, color: "text-success" },
          { label: "Pendentes", value: budgets.filter(b => b.status === "enviado").length, color: "text-accent" },
          { label: "Valor Total", value: formatCurrency(totalValue), color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i} className="animate-fade-in">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, projeto ou número..."
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
            <FileText className="h-5 w-5 text-accent" />
            Lista de Orçamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium text-accent">{budget.number}</TableCell>
                  <TableCell>{budget.client}</TableCell>
                  <TableCell>{budget.project}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(budget.value)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusLabels[budget.status].class}`}>
                      {statusLabels[budget.status].label}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(budget.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                           <Link to={`/orcamentos/editar/${budget.id}`}>
                             <Edit2 className="mr-2 h-4 w-4" />
                             Editar
                           </Link>
                         </DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuSub>
                           <DropdownMenuSubTrigger>
                             <Clock className="mr-2 h-4 w-4" />
                             Alterar Status
                           </DropdownMenuSubTrigger>
                           <DropdownMenuSubContent>
                             <DropdownMenuItem onClick={() => handleStatusChange(budget.id, "aprovado")}>
                               <CheckCircle className="mr-2 h-4 w-4 text-success" />
                               Aprovado
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusChange(budget.id, "recusado")}>
                               <XCircle className="mr-2 h-4 w-4 text-destructive" />
                               Negado
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusChange(budget.id, "em_andamento")}>
                               <PlayCircle className="mr-2 h-4 w-4 text-accent" />
                               Em Execução
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusChange(budget.id, "concluido")}>
                               <CheckCircle className="mr-2 h-4 w-4 text-success" />
                               Executado/Concluído
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem onClick={() => handleStatusChange(budget.id, "rascunho")}>
                               <FileText className="mr-2 h-4 w-4" />
                               Rascunho
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusChange(budget.id, "enviado")}>
                               <Send className="mr-2 h-4 w-4" />
                               Enviado
                             </DropdownMenuItem>
                           </DropdownMenuSubContent>
                         </DropdownMenuSub>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar ao Cliente
                        </DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem
                           className="text-destructive focus:text-destructive"
                           onClick={() => handleDeleteClick(budget)}
                         >
                           <Trash2 className="mr-2 h-4 w-4" />
                           Excluir
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       {/* Delete Confirmation Dialog */}
       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Excluir Orçamento</AlertDialogTitle>
             <AlertDialogDescription>
               Tem certeza que deseja excluir o orçamento{" "}
               <strong>{budgetToDelete?.number}</strong> de{" "}
               <strong>{budgetToDelete?.client}</strong>?
               <br />
               Esta ação não pode ser desfeita.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel>Cancelar</AlertDialogCancel>
             <AlertDialogAction
               onClick={handleConfirmDelete}
               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
             >
               Excluir
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
    </AppLayout>
  );
};

export default Orcamentos;
