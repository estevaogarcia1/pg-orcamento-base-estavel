import { Link } from "react-router-dom";
import { 
  FileText, 
  Users, 
  Calendar, 
  DollarSign, 
  ClipboardCheck, 
  Bot,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <AppLayout>
      <PageHeader 
        title="Dashboard" 
        description="Bem-vindo ao sistema de gestão P&G Reformas"
      >
        <Button asChild>
          <Link to="/orcamentos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Link>
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Orçamentos Ativos"
          value={12}
          description="3 aguardando aprovação"
          icon={FileText}
          variant="accent"
          href="/orcamentos"
        />
        <StatCard
          title="Clientes"
          value={48}
          description="+5 este mês"
          icon={Users}
          trend={{ value: 12, positive: true }}
          href="/clientes"
        />
        <StatCard
          title="Obras em Andamento"
          value={4}
          description="2 finalizando esta semana"
          icon={Clock}
          href="/cronograma"
        />
        <StatCard
          title="Faturamento Mensal"
          value="R$ 87.500"
          description="Meta: R$ 100.000"
          icon={DollarSign}
          variant="success"
          href="/financeiro"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-accent" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="justify-start h-auto py-4" asChild>
                <Link to="/orcamentos/novo">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent/10 p-2">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Novo Orçamento</p>
                      <p className="text-xs text-muted-foreground">Criar orçamento</p>
                    </div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4" asChild>
                <Link to="/clientes">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Novo Cliente</p>
                      <p className="text-xs text-muted-foreground">Cadastrar cliente</p>
                    </div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4" asChild>
                <Link to="/agenda">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-success/10 p-2">
                      <Calendar className="h-5 w-5 text-success" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Agendar Visita</p>
                      <p className="text-xs text-muted-foreground">Visita técnica</p>
                    </div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4" asChild>
                <Link to="/assistente-ia">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent/10 p-2">
                      <Bot className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Assistente IA</p>
                      <p className="text-xs text-muted-foreground">Ajuda inteligente</p>
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Budgets */}
        <Card className="animate-slide-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Orçamentos Recentes
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/orcamentos">
                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { client: "João Silva", project: "Reforma Cozinha", value: "R$ 15.800", status: "Aprovado" },
                { client: "Maria Santos", project: "Banheiro Suíte", value: "R$ 8.500", status: "Pendente" },
                { client: "Carlos Oliveira", project: "Sala Comercial", value: "R$ 45.000", status: "Em análise" },
              ].map((budget, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{budget.client}</p>
                    <p className="text-sm text-muted-foreground">{budget.project}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-accent">{budget.value}</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        budget.status === "Aprovado"
                          ? "bg-success/10 text-success"
                          : budget.status === "Pendente"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {budget.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <div className="mt-6">
        <Card className="animate-slide-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-accent" />
              Próximas Atividades
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/agenda">
                Ver agenda <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { date: "Hoje, 14:00", task: "Visita técnica - Ap. 302", client: "Roberto Lima" },
                { date: "Amanhã, 09:30", task: "Entrega orçamento", client: "Ana Paula" },
                { date: "25/01, 10:00", task: "Início obra - Cozinha", client: "Fernando Costa" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border p-4 transition-all hover:border-accent hover:shadow-sm"
                >
                  <p className="text-xs font-medium text-accent">{activity.date}</p>
                  <p className="mt-1 font-medium">{activity.task}</p>
                  <p className="text-sm text-muted-foreground">{activity.client}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
