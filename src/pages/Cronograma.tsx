import { useState, useEffect } from "react";
import { Plus, Calendar, CheckCircle2, Circle, Clock, MoreHorizontal, Bot, Edit2, Trash2, FolderPlus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

interface Stage {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "pendente" | "em_andamento" | "concluido";
  progress: number;
}

interface Project {
  id: string;
  name: string;
  client: string;
  stages: Stage[];
}

const statusLabels = {
  pendente: { label: "Pendente", icon: Circle, color: "text-muted-foreground" },
  em_andamento: { label: "Em Andamento", icon: Clock, color: "text-accent" },
  concluido: { label: "Concluído", icon: CheckCircle2, color: "text-success" },
};

const STORAGE_KEY = "pg-cronograma-data";

const defaultProjects: Project[] = [
  {
    id: "1",
    name: "Reforma Cozinha Completa",
    client: "João Silva",
    stages: [
      { id: "1", name: "Demolição", startDate: "2024-01-15", endDate: "2024-01-18", status: "concluido", progress: 100 },
      { id: "2", name: "Hidráulica e Elétrica", startDate: "2024-01-19", endDate: "2024-01-25", status: "concluido", progress: 100 },
      { id: "3", name: "Contrapiso e Reboco", startDate: "2024-01-26", endDate: "2024-02-01", status: "em_andamento", progress: 60 },
      { id: "4", name: "Revestimentos", startDate: "2024-02-02", endDate: "2024-02-10", status: "pendente", progress: 0 },
      { id: "5", name: "Marcenaria", startDate: "2024-02-11", endDate: "2024-02-18", status: "pendente", progress: 0 },
      { id: "6", name: "Acabamentos", startDate: "2024-02-19", endDate: "2024-02-22", status: "pendente", progress: 0 },
    ],
  },
  {
    id: "2",
    name: "Banheiro Suíte Master",
    client: "Maria Santos",
    stages: [
      { id: "1", name: "Demolição", startDate: "2024-01-20", endDate: "2024-01-22", status: "concluido", progress: 100 },
      { id: "2", name: "Hidráulica", startDate: "2024-01-23", endDate: "2024-01-26", status: "em_andamento", progress: 40 },
      { id: "3", name: "Revestimentos", startDate: "2024-01-27", endDate: "2024-02-02", status: "pendente", progress: 0 },
      { id: "4", name: "Louças e Metais", startDate: "2024-02-03", endDate: "2024-02-05", status: "pendente", progress: 0 },
    ],
  },
];

const loadProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading projects:", error);
  }
  return defaultProjects;
};

const saveProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Error saving projects:", error);
  }
};

const getEmptyStage = (): Omit<Stage, "id"> => ({
  name: "",
  startDate: "",
  endDate: "",
  status: "pendente",
  progress: 0,
});

const getEmptyProject = (): Omit<Project, "id"> => ({
  name: "",
  client: "",
  stages: [],
});

const Cronograma = () => {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [selectedProject, setSelectedProject] = useState<string>(projects[0]?.id || "");
  
  // Stage dialog state
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [stageForm, setStageForm] = useState<Omit<Stage, "id">>(getEmptyStage());
  
  // Project dialog state
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<Project, "id">>(getEmptyProject());
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "stage" | "project"; id: string } | null>(null);

  const project = projects.find((p) => p.id === selectedProject);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  const totalProgress = project
    ? Math.round(project.stages.reduce((acc, s) => acc + s.progress, 0) / (project.stages.length || 1))
    : 0;

  // Stage handlers
  const handleOpenStageDialog = (stage?: Stage) => {
    if (stage) {
      setEditingStage(stage);
      setStageForm({
        name: stage.name,
        startDate: stage.startDate,
        endDate: stage.endDate,
        status: stage.status,
        progress: stage.progress,
      });
    } else {
      setEditingStage(null);
      setStageForm(getEmptyStage());
    }
    setIsStageDialogOpen(true);
  };

  const handleCloseStageDialog = () => {
    setIsStageDialogOpen(false);
    setEditingStage(null);
    setStageForm(getEmptyStage());
  };

  const handleSaveStage = () => {
    if (!stageForm.name.trim()) {
      toast({ title: "Erro", description: "O nome da etapa é obrigatório.", variant: "destructive" });
      return;
    }
    if (!stageForm.startDate) {
      toast({ title: "Erro", description: "A data de início é obrigatória.", variant: "destructive" });
      return;
    }
    if (!stageForm.endDate) {
      toast({ title: "Erro", description: "A data de fim é obrigatória.", variant: "destructive" });
      return;
    }

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== selectedProject) return p;
        
        if (editingStage) {
          return {
            ...p,
            stages: p.stages.map((s) =>
              s.id === editingStage.id ? { ...stageForm, id: editingStage.id } : s
            ),
          };
        } else {
          return {
            ...p,
            stages: [...p.stages, { ...stageForm, id: Date.now().toString() }],
          };
        }
      })
    );

    toast({
      title: "Sucesso",
      description: editingStage ? "Etapa atualizada com sucesso!" : "Etapa criada com sucesso!",
    });
    handleCloseStageDialog();
  };

  const handleStageStatusChange = (stageId: string, status: Stage["status"]) => {
    const progress = status === "concluido" ? 100 : status === "pendente" ? 0 : undefined;
    
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== selectedProject) return p;
        return {
          ...p,
          stages: p.stages.map((s) =>
            s.id === stageId
              ? { ...s, status, ...(progress !== undefined ? { progress } : {}) }
              : s
          ),
        };
      })
    );

    toast({
      title: "Sucesso",
      description: `Status alterado para "${statusLabels[status].label}"`,
    });
  };

  const handleStageProgressChange = (stageId: string, progress: number) => {
    let status: Stage["status"] = "em_andamento";
    if (progress === 0) status = "pendente";
    if (progress === 100) status = "concluido";

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== selectedProject) return p;
        return {
          ...p,
          stages: p.stages.map((s) =>
            s.id === stageId ? { ...s, progress, status } : s
          ),
        };
      })
    );
  };

  // Project handlers
  const handleOpenProjectDialog = (proj?: Project) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({ name: proj.name, client: proj.client, stages: proj.stages });
    } else {
      setEditingProject(null);
      setProjectForm(getEmptyProject());
    }
    setIsProjectDialogOpen(true);
  };

  const handleCloseProjectDialog = () => {
    setIsProjectDialogOpen(false);
    setEditingProject(null);
    setProjectForm(getEmptyProject());
  };

  const handleSaveProject = () => {
    if (!projectForm.name.trim()) {
      toast({ title: "Erro", description: "O nome do projeto é obrigatório.", variant: "destructive" });
      return;
    }
    if (!projectForm.client.trim()) {
      toast({ title: "Erro", description: "O nome do cliente é obrigatório.", variant: "destructive" });
      return;
    }

    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id
            ? { ...p, name: projectForm.name, client: projectForm.client }
            : p
        )
      );
      toast({ title: "Sucesso", description: "Projeto atualizado com sucesso!" });
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectForm.name,
        client: projectForm.client,
        stages: [],
      };
      setProjects((prev) => [...prev, newProject]);
      setSelectedProject(newProject.id);
      toast({ title: "Sucesso", description: "Projeto criado com sucesso!" });
    }

    handleCloseProjectDialog();
  };

  // Delete handlers
  const handleDeleteClick = (type: "stage" | "project", id: string) => {
    setDeleteTarget({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "stage") {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== selectedProject) return p;
          return { ...p, stages: p.stages.filter((s) => s.id !== deleteTarget.id) };
        })
      );
      toast({ title: "Sucesso", description: "Etapa excluída com sucesso!" });
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      if (selectedProject === deleteTarget.id) {
        const remaining = projects.filter((p) => p.id !== deleteTarget.id);
        setSelectedProject(remaining[0]?.id || "");
      }
      toast({ title: "Sucesso", description: "Projeto excluído com sucesso!" });
    }

    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  return (
    <AppLayout>
      <PageHeader title="Cronograma" description="Acompanhe etapas e prazos das obras">
        <Button variant="outline" onClick={() => handleOpenProjectDialog()}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
        <Button onClick={() => handleOpenStageDialog()} disabled={!project}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Etapa
        </Button>
      </PageHeader>

      {/* Project Selector */}
      <div className="mb-6 flex items-center gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Selecione um projeto" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name} - {p.client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {project && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleOpenProjectDialog(project)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Editar Projeto
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick("project", project.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Projeto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {projects.length === 0 ? (
        <Card className="animate-fade-in">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum projeto cadastrado</p>
            <Button onClick={() => handleOpenProjectDialog()}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Criar Primeiro Projeto
            </Button>
          </CardContent>
        </Card>
      ) : project ? (
        <>
          {/* Progress Overview */}
          <Card className="mb-6 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">Cliente: {project.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-accent">{totalProgress}%</p>
                  <p className="text-sm text-muted-foreground">Progresso Total</p>
                </div>
              </div>
              <Progress value={totalProgress} className="h-3" />
            </CardContent>
          </Card>

          {/* Stages Timeline */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Etapas do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.stages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Nenhuma etapa cadastrada</p>
                  <Button onClick={() => handleOpenStageDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeira Etapa
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.stages.map((stage, index) => {
                    const StatusIcon = statusLabels[stage.status].icon;
                    return (
                      <div
                        key={stage.id}
                        className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{stage.name}</h4>
                            <StatusIcon className={`h-4 w-4 ${statusLabels[stage.status].color}`} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {new Date(stage.startDate + "T00:00:00").toLocaleDateString("pt-BR")} -{" "}
                              {new Date(stage.endDate + "T00:00:00").toLocaleDateString("pt-BR")}
                            </span>
                            <span className={statusLabels[stage.status].color}>
                              {statusLabels[stage.status].label}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex-1">
                              <Slider
                                value={[stage.progress]}
                                onValueChange={([value]) => handleStageProgressChange(stage.id, value)}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{stage.progress}%</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenStageDialog(stage)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Clock className="mr-2 h-4 w-4" />
                                Alterar Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => handleStageStatusChange(stage.id, "pendente")}>
                                  <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                                  Pendente
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStageStatusChange(stage.id, "em_andamento")}>
                                  <Clock className="mr-2 h-4 w-4 text-accent" />
                                  Em Andamento
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStageStatusChange(stage.id, "concluido")}>
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
                                  Concluído
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick("stage", stage.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}

      {/* Stage Dialog */}
      <Dialog open={isStageDialogOpen} onOpenChange={(open) => !open && handleCloseStageDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStage ? "Editar Etapa" : "Nova Etapa"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome da Etapa *</Label>
              <Input
                placeholder="Ex: Demolição, Hidráulica, etc."
                value={stageForm.name}
                onChange={(e) => setStageForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Data Início *</Label>
                <Input
                  type="date"
                  value={stageForm.startDate}
                  onChange={(e) => setStageForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Data Fim *</Label>
                <Input
                  type="date"
                  value={stageForm.endDate}
                  onChange={(e) => setStageForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={stageForm.status}
                onValueChange={(value: Stage["status"]) =>
                  setStageForm((prev) => ({ ...prev, status: value }))
                }
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
            <div className="grid gap-2">
              <Label>Progresso: {stageForm.progress}%</Label>
              <Slider
                value={[stageForm.progress]}
                onValueChange={([value]) => setStageForm((prev) => ({ ...prev, progress: value }))}
                max={100}
                step={5}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseStageDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveStage}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={(open) => !open && handleCloseProjectDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome do Projeto *</Label>
              <Input
                placeholder="Ex: Reforma Cozinha Completa"
                value={projectForm.name}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Cliente *</Label>
              <Input
                placeholder="Nome do cliente"
                value={projectForm.client}
                onChange={(e) => setProjectForm((prev) => ({ ...prev, client: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseProjectDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProject}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "project"
                ? "Tem certeza que deseja excluir este projeto? Todas as etapas também serão excluídas. Esta ação não pode ser desfeita."
                : "Tem certeza que deseja excluir esta etapa? Esta ação não pode ser desfeita."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Cronograma;
