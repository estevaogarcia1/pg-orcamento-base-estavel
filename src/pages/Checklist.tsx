import { useState } from "react";
import { Plus, CheckCircle, Circle, Bot, Download, MoreHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface Checklist {
  id: string;
  project: string;
  client: string;
  createdAt: string;
  items: ChecklistItem[];
}

const mockChecklists: Checklist[] = [
  {
    id: "1",
    project: "Reforma Cozinha Completa",
    client: "João Silva",
    createdAt: "2024-01-20",
    items: [
      { id: "1", text: "Verificar acabamento de piso", checked: true },
      { id: "2", text: "Testar pontos elétricos", checked: true },
      { id: "3", text: "Verificar vedação de torneiras", checked: false },
      { id: "4", text: "Testar funcionamento de gavetas", checked: false },
      { id: "5", text: "Verificar pintura e retoques", checked: false },
      { id: "6", text: "Limpeza final do ambiente", checked: false },
      { id: "7", text: "Fotografar ambiente finalizado", checked: false },
    ],
  },
];

const Checklist = () => {
  const [checklists, setChecklists] = useState<Checklist[]>(mockChecklists);
  const [selectedChecklist, setSelectedChecklist] = useState<string>(mockChecklists[0]?.id || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const checklist = checklists.find((c) => c.id === selectedChecklist);
  const completedCount = checklist?.items.filter((i) => i.checked).length || 0;
  const totalCount = checklist?.items.length || 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleItem = (itemId: string) => {
    setChecklists(
      checklists.map((cl) =>
        cl.id === selectedChecklist
          ? {
              ...cl,
              items: cl.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : cl
      )
    );
  };

  return (
    <AppLayout>
      <PageHeader title="Checklist de Entrega" description="Controle de itens para entrega final">
        <Button variant="outline">
          <Bot className="mr-2 h-4 w-4" />
          Gerar com IA
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Checklist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Novo Checklist</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Projeto</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Reforma João Silva</SelectItem>
                    <SelectItem value="2">Reforma Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Itens do Checklist</Label>
                <p className="text-sm text-muted-foreground">
                  Você pode adicionar itens manualmente ou usar a IA para gerar automaticamente.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button>Criar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Project Selector */}
      <div className="mb-6">
        <Select value={selectedChecklist} onValueChange={setSelectedChecklist}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Selecione um checklist" />
          </SelectTrigger>
          <SelectContent>
            {checklists.map((cl) => (
              <SelectItem key={cl.id} value={cl.id}>
                {cl.project} - {cl.client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {checklist && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Checklist */}
          <div className="lg:col-span-2">
            <Card className="animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{checklist.project}</CardTitle>
                  <p className="text-sm text-muted-foreground">Cliente: {checklist.client}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {checklist.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 rounded-lg border p-4 transition-colors cursor-pointer hover:bg-muted/50 ${
                        item.checked ? "border-success/50 bg-success/5" : "border-border"
                      }`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <Checkbox checked={item.checked} />
                      <span className={item.checked ? "line-through text-muted-foreground" : ""}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-2">
                  <Input placeholder="Adicionar novo item..." className="flex-1" />
                  <Button>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress */}
          <div>
            <Card className="animate-fade-in sticky top-6">
              <CardHeader>
                <CardTitle>Progresso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-flex">
                    <svg className="w-32 h-32">
                      <circle
                        className="text-muted"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className="text-accent"
                        strokeWidth="8"
                        strokeDasharray={`${progress * 3.52} 352`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                      {progress}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Concluídos</span>
                    <span className="font-medium text-success">{completedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pendentes</span>
                    <span className="font-medium">{totalCount - completedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{totalCount}</span>
                  </div>
                </div>

                {progress === 100 && (
                  <div className="rounded-lg bg-success/10 p-4 text-center">
                    <CheckCircle className="mx-auto h-8 w-8 text-success mb-2" />
                    <p className="font-medium text-success">Checklist Completo!</p>
                    <p className="text-sm text-muted-foreground">Pronto para entrega</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Checklist;
