import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, FileText, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
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

interface ProjectReport {
  id: string;
  project: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  period: string;
}

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

const Relatorios = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  // Get unique months from transactions
  const availableMonths = [...new Set(transactions.map((t) => getMonthYear(t.date)))].sort().reverse();

  // Filter transactions by period
  const filteredTransactions = selectedPeriod === "all" 
    ? transactions 
    : transactions.filter((t) => getMonthYear(t.date) === selectedPeriod);

  // Calculate totals from filtered transactions
  const totalRevenue = filteredTransactions
    .filter(t => t.type === "entrada")
    .reduce((acc, t) => acc + t.value, 0);
  
  const totalCosts = filteredTransactions
    .filter(t => t.type === "saida")
    .reduce((acc, t) => acc + t.value, 0);
  
  const totalProfit = totalRevenue - totalCosts;
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Group by project
  const projectReports: ProjectReport[] = (() => {
    const projectMap = new Map<string, { revenue: number; costs: number }>();
    
    filteredTransactions.forEach((t) => {
      const projectName = t.project || "Sem Projeto";
      const current = projectMap.get(projectName) || { revenue: 0, costs: 0 };
      
      if (t.type === "entrada") {
        current.revenue += t.value;
      } else {
        current.costs += t.value;
      }
      
      projectMap.set(projectName, current);
    });

    return Array.from(projectMap.entries()).map(([project, data], index) => ({
      id: String(index + 1),
      project,
      revenue: data.revenue,
      costs: data.costs,
      profit: data.revenue - data.costs,
      margin: data.revenue > 0 ? ((data.revenue - data.costs) / data.revenue) * 100 : 0,
      period: selectedPeriod === "all" ? "Todos" : formatMonthYear(selectedPeriod),
    }));
  })();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <AppLayout>
      <PageHeader title="Relatórios" description="Análise de lucro líquido por período">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month}>
                  {formatMonthYear(month)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatCard
          title="Faturamento Total"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          variant="default"
          href="/financeiro"
        />
        <StatCard
          title="Custos Totais"
          value={formatCurrency(totalCosts)}
          icon={TrendingUp}
          variant="default"
          href="/financeiro"
        />
        <StatCard
          title="Lucro Líquido"
          value={formatCurrency(totalProfit)}
          icon={BarChart3}
          variant={totalProfit >= 0 ? "success" : "warning"}
          href="/financeiro"
        />
        <StatCard
          title="Margem Média"
          value={`${avgMargin.toFixed(1)}%`}
          icon={FileText}
          variant="accent"
        />
      </div>

      {/* Projects Table */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Análise por Projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projectReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada para o período selecionado.
              <br />
              <span className="text-sm">Cadastre transações no módulo Financeiro para visualizar os relatórios.</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead className="text-right">Faturamento</TableHead>
                  <TableHead className="text-right">Custos</TableHead>
                  <TableHead className="text-right">Lucro</TableHead>
                  <TableHead className="text-right">Margem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.project}</TableCell>
                    <TableCell className="text-right">{formatCurrency(report.revenue)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(report.costs)}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${report.profit >= 0 ? "text-success" : "text-destructive"}`}>
                      {formatCurrency(report.profit)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        report.margin >= 40 ? "bg-success/10 text-success" : 
                        report.margin >= 0 ? "bg-accent/10 text-accent" : 
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {report.margin.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="mt-6 animate-fade-in border-accent/20 bg-accent/5">
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total de Transações</p>
              <p className="text-3xl font-bold">{filteredTransactions.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Lucro Total</p>
              <p className={`text-3xl font-bold ${totalProfit >= 0 ? "text-success" : "text-destructive"}`}>
                {formatCurrency(totalProfit)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Projetos Ativos</p>
              <p className="text-3xl font-bold text-accent">
                {projectReports.filter(p => p.project !== "Sem Projeto").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Relatorios;
