import { Settings } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Configuracoes = () => {
  return (
    <AppLayout>
      <PageHeader title="Configurações" description="Personalize o funcionamento do sistema" />

      <div className="space-y-6 max-w-2xl">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure suas preferências de notificação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-muted-foreground">Receber atualizações por e-mail</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Lembretes de Agenda</Label>
                <p className="text-sm text-muted-foreground">Notificar sobre compromissos</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertas de Vencimento</Label>
                <p className="text-sm text-muted-foreground">Orçamentos próximos do vencimento</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Orçamentos</CardTitle>
            <CardDescription>Configurações padrão para orçamentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Validade Padrão</Label>
                <p className="text-sm text-muted-foreground">15 dias de validade</p>
              </div>
              <Button variant="outline" size="sm">Alterar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Numeração Automática</Label>
                <p className="text-sm text-muted-foreground">ORC-AAAA-XXX</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Incluir Termos no PDF</Label>
                <p className="text-sm text-muted-foreground">Adicionar termos e condições</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Assistente IA</CardTitle>
            <CardDescription>Configurações do assistente inteligente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Sugestões Automáticas</Label>
                <p className="text-sm text-muted-foreground">Receber sugestões de serviços</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Buscar Preços RS</Label>
                <p className="text-sm text-muted-foreground">Consultar preços da região</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Dados e Backup</CardTitle>
            <CardDescription>Gerencie seus dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Backup Automático</Label>
                <p className="text-sm text-muted-foreground">Backup diário dos dados</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Exportar Dados</Button>
              <Button variant="outline">Importar Dados</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Configuracoes;
