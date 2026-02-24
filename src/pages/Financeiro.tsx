import { useState, useEffect } from "react";
import { Plus, DollarSign, TrendingUp, TrendingDown, CreditCard, Users, Package, Pencil, Trash2, Check, X, Wrench, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "entrada" | "saida";
  category: "material" | "ferramenta" | "pagamento" | "vale" | "recebimento";
  description: string;
  value: number;
  date: string;
  project?: string;
  received: boolean;
}

const categoryLabels: Record<Transaction["category"], string> = {
  material: "Material",
  ferramenta: "Ferramenta",
  pagamento: "Pagamento Equipe",
  vale: "Vale",
  recebimento: "Recebimento",
};

const categoryIcons: Record<Transaction["category"], React.ReactNode> = {
  material: <Package className="h-3 w-3" />,
  ferramenta: <Wrench className="h-3 w-3" />,
  pagamento: <Users className="h-3 w-3" />,
  vale: <CreditCard className="h-3 w-3" />,
  recebimento: <DollarSign className="h-3 w-3" />,
};

const STORAGE_KEY = "pg-financeiro-data";

const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar transações:", error);
  }
  return [];
};

const saveTransactions = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Erro ao salvar transações:", error);
  }
};

const getMonthYear = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const formatMonthYear = (monthYear: string) => {
  const [year, month] = monthYear.split("-");
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

const Financeiro = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [formData, setFormData] = useState({
    type: "entrada" as "entrada" | "saida",
    category: "recebimento" as Transaction["category"],
    description: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
    project: "",
    received: false,
  });

  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  // Get unique months from transactions
  const availableMonths = [...new Set(transactions.map((t) => getMonthYear(t.date)))].sort().reverse();

  // Filter transactions by month
  const filteredByMonth = selectedMonth === "all" 
    ? transactions 
    : transactions.filter((t) => getMonthYear(t.date) === selectedMonth);

  // Calculate totals
  const entradas = filteredByMonth.filter(t => t.type === "entrada").reduce((acc, t) => acc + t.value, 0);
  const entradasRecebidas = filteredByMonth.filter(t => t.type === "entrada" && t.received).reduce((acc, t) => acc + t.value, 0);
  const saidas = filteredByMonth.filter(t => t.type === "saida").reduce((acc, t) => acc + t.value, 0);
  const saidasPagas = filteredByMonth.filter(t => t.type === "saida" && t.received).reduce((acc, t) => acc + t.value, 0);
  const saldo = entradasRecebidas - saidasPagas;

  // Monthly summary
  const monthlySummary = availableMonths.map((month) => {
    const monthTransactions = transactions.filter((t) => getMonthYear(t.date) === month);
    const monthEntradas = monthTransactions.filter(t => t.type === "entrada").reduce((acc, t) => acc + t.value, 0);
    const monthSaidas = monthTransactions.filter(t => t.type === "saida").reduce((acc, t) => acc + t.value, 0);
    return {
      month,
      entradas: monthEntradas,
      saidas: monthSaidas,
      saldo: monthEntradas - monthSaidas,
    };
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const resetForm = () => {
    setFormData({
      type: "entrada",
      category: "recebimento",
      description: "",
      value: "",
      date: new Date().toISOString().split("T")[0],
      project: "",
      received: false,
    });
    setEditingTransaction(null);
  };

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        value: transaction.value.toString(),
        date: transaction.date,
        project: transaction.project || "",
        received: transaction.received,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.description.trim() || !formData.value || !formData.date) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const value = parseFloat(formData.value.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      toast.error("Valor inválido");
      return;
    }

    const transactionData: Transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      type: formData.type,
      category: formData.category,
      description: formData.description.trim(),
      value,
      date: formData.date,
      project: formData.project.trim() || undefined,
      received: formData.received,
    };

    let updatedTransactions: Transaction[];
    if (editingTransaction) {
      updatedTransactions = transactions.map((t) =>
        t.id === editingTransaction.id ? transactionData : t
      );
      toast.success("Transação atualizada com sucesso!");
    } else {
      updatedTransactions = [...transactions, transactionData];
      toast.success("Transação cadastrada com sucesso!");
    }

    // Sort by date descending
    updatedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!transactionToDelete) return;

    const updatedTransactions = transactions.filter((t) => t.id !== transactionToDelete.id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    setIsDeleteDialogOpen(false);
    setTransactionToDelete(null);
    toast.success("Transação excluída com sucesso!");
  };

  const handleToggleReceived = (transaction: Transaction) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === transaction.id ? { ...t, received: !t.received } : t
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    toast.success(
      transaction.received 
        ? `Transação marcada como ${transaction.type === "entrada" ? "não recebida" : "não paga"}`
        : `Transação marcada como ${transaction.type === "entrada" ? "recebida" : "paga"}`
    );
  };

  const filterByCategory = (category: string) => {
    if (category === "materiais") {
      return filteredByMonth.filter((t) => t.category === "material" || t.category === "ferramenta");
    }
    if (category === "equipe") {
      return filteredByMonth.filter((t) => t.category === "pagamento" || t.category === "vale");
    }
    if (category === "recebimentos") {
      return filteredByMonth.filter((t) => t.category === "recebimento");
    }
    return filteredByMonth;
  };

  const renderTransactionsTable = (transactionsList: Transaction[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Projeto</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactionsList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
              Nenhuma transação encontrada
            </TableCell>
          </TableRow>
        ) : (
          transactionsList.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{new Date(t.date).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                  {categoryIcons[t.category]}
                  {categoryLabels[t.category]}
                </span>
              </TableCell>
              <TableCell>{t.project || "-"}</TableCell>
              <TableCell>
                <Badge 
                  variant={t.received ? "default" : "secondary"}
                  className={t.received ? "bg-success text-success-foreground" : ""}
                >
                  {t.type === "entrada" 
                    ? (t.received ? "Recebido" : "Pendente")
                    : (t.received ? "Pago" : "Pendente")
                  }
                </Badge>
              </TableCell>
              <TableCell className={`text-right font-semibold ${t.type === "entrada" ? "text-success" : "text-destructive"}`}>
                {t.type === "entrada" ? "+" : "-"} {formatCurrency(t.value)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleReceived(t)}
                    title={t.received ? "Marcar como pendente" : (t.type === "entrada" ? "Marcar como recebido" : "Marcar como pago")}
                  >
                    {t.received ? (
                      <X className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Check className="h-4 w-4 text-success" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(t)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(t)}
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <AppLayout>
      <PageHeader title="Financeiro" description="Controle de gastos, compras e pagamentos">
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </PageHeader>

      {/* Month Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label>Período:</Label>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os meses</SelectItem>
            {availableMonths.map((month) => (
              <SelectItem key={month} value={month}>
                {formatMonthYear(month)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatCard
          title="Entradas"
          value={formatCurrency(entradas)}
          description={`${formatCurrency(entradasRecebidas)} recebido`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Saídas"
          value={formatCurrency(saidas)}
          description={`${formatCurrency(saidasPagas)} pago`}
          icon={TrendingDown}
          variant="default"
        />
        <StatCard
          title="Saldo Real"
          value={formatCurrency(saldo)}
          description="Recebido - Pago"
          icon={DollarSign}
          variant={saldo >= 0 ? "accent" : "default"}
        />
        <StatCard
          title="Projetado"
          value={formatCurrency(entradas - saidas)}
          description="Entradas - Saídas"
          icon={DollarSign}
          variant="default"
        />
      </div>

      {/* Monthly Summary */}
      {monthlySummary.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Balanço Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead className="text-right">Entradas</TableHead>
                  <TableHead className="text-right">Saídas</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlySummary.map((summary) => (
                  <TableRow 
                    key={summary.month}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedMonth(summary.month)}
                  >
                    <TableCell className="font-medium">{formatMonthYear(summary.month)}</TableCell>
                    <TableCell className="text-right text-success">{formatCurrency(summary.entradas)}</TableCell>
                    <TableCell className="text-right text-destructive">{formatCurrency(summary.saidas)}</TableCell>
                    <TableCell className={`text-right font-semibold ${summary.saldo >= 0 ? "text-success" : "text-destructive"}`}>
                      {formatCurrency(summary.saldo)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="todas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
          <TabsTrigger value="recebimentos">Recebimentos</TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Movimentações</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTransactionsTable(filterByCategory("todas"))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materiais">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Materiais e Ferramentas</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTransactionsTable(filterByCategory("materiais"))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipe">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Pagamentos da Equipe</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTransactionsTable(filterByCategory("equipe"))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recebimentos">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Recebimentos</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTransactionsTable(filterByCategory("recebimentos"))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "Editar Transação" : "Nova Transação"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "entrada" | "saida") => {
                  setFormData({ 
                    ...formData, 
                    type: value,
                    category: value === "entrada" ? "recebimento" : "material"
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: Transaction["category"]) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formData.type === "entrada" ? (
                    <SelectItem value="recebimento">Recebimento</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="ferramenta">Ferramenta</SelectItem>
                      <SelectItem value="pagamento">Pagamento Equipe</SelectItem>
                      <SelectItem value="vale">Vale</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Compra de cimento"
              />
            </div>

            <div className="space-y-2">
              <Label>Valor (R$) *</Label>
              <Input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label>Data *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Projeto/Obra</Label>
              <Input
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="Ex: Reforma Apartamento 101"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="received"
                checked={formData.received}
                onChange={(e) => setFormData({ ...formData, received: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="received" className="cursor-pointer">
                {formData.type === "entrada" ? "Já recebido" : "Já pago"}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingTransaction ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Transação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a transação "{transactionToDelete?.description}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Financeiro;
