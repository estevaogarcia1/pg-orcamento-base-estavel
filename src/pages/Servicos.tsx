import { useState } from "react";
import { Plus, Search, Edit2, Trash2, ChevronDown, ChevronUp, Package } from "lucide-react";
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

interface Material {
  id: string;
  name: string;
  unit: string;
  quantityPerUnit: number; // Quantidade por unidade do serviço
}

interface Service {
  id: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  description: string;
  materials: Material[];
}

const categories = [
  "Alvenaria",
  "Elétrica",
  "Hidráulica",
  "Pintura",
  "Piso",
  "Gesso",
  "Marcenaria",
  "Demolição",
  "Acabamento",
  "Outros",
];

const units = ["m²", "m", "un", "h", "diária", "verba"];

const materialUnits = ["un", "kg", "m", "m²", "litro", "saco", "rolo", "caixa", "pacote"];

const mockServices: Service[] = [
  { 
    id: "1", 
    name: "Assentamento de Piso Cerâmico", 
    category: "Piso", 
    unit: "m²", 
    unitPrice: 45, 
    description: "Inclui material de assentamento",
    materials: [
      { id: "m1", name: "Argamassa AC-II", unit: "kg", quantityPerUnit: 5 },
      { id: "m2", name: "Espaçadores 2mm", unit: "un", quantityPerUnit: 20 },
      { id: "m3", name: "Rejunte", unit: "kg", quantityPerUnit: 0.5 },
    ]
  },
  { 
    id: "2", 
    name: "Pintura Látex PVA", 
    category: "Pintura", 
    unit: "m²", 
    unitPrice: 18, 
    description: "2 demãos, preparação de superfície",
    materials: [
      { id: "m4", name: "Tinta Látex PVA", unit: "litro", quantityPerUnit: 0.2 },
      { id: "m5", name: "Massa Corrida", unit: "kg", quantityPerUnit: 0.3 },
      { id: "m6", name: "Lixa 150", unit: "un", quantityPerUnit: 0.1 },
    ]
  },
  { 
    id: "3", 
    name: "Instalação de Ponto Elétrico", 
    category: "Elétrica", 
    unit: "un", 
    unitPrice: 120, 
    description: "Ponto simples com fiação",
    materials: [
      { id: "m7", name: "Cabo 2,5mm", unit: "m", quantityPerUnit: 10 },
      { id: "m8", name: "Caixa 4x2", unit: "un", quantityPerUnit: 1 },
      { id: "m9", name: "Tomada 10A", unit: "un", quantityPerUnit: 1 },
    ]
  },
  { 
    id: "4", 
    name: "Instalação de Ponto Hidráulico", 
    category: "Hidráulica", 
    unit: "un", 
    unitPrice: 180, 
    description: "Água fria ou quente",
    materials: [
      { id: "m10", name: "Tubo PVC 25mm", unit: "m", quantityPerUnit: 3 },
      { id: "m11", name: "Joelho 90° 25mm", unit: "un", quantityPerUnit: 2 },
      { id: "m12", name: "Cola para PVC", unit: "un", quantityPerUnit: 0.1 },
    ]
  },
  { 
    id: "5", 
    name: "Forro de Gesso", 
    category: "Gesso", 
    unit: "m²", 
    unitPrice: 65, 
    description: "Forro liso com acabamento",
    materials: [
      { id: "m13", name: "Placa de Gesso", unit: "m²", quantityPerUnit: 1.1 },
      { id: "m14", name: "Arame Galvanizado", unit: "m", quantityPerUnit: 2 },
      { id: "m15", name: "Prego", unit: "un", quantityPerUnit: 4 },
    ]
  },
  { id: "6", name: "Demolição de Alvenaria", category: "Demolição", unit: "m²", unitPrice: 35, description: "Inclui remoção de entulho", materials: [] },
  { id: "7", name: "Mão de Obra Pedreiro", category: "Alvenaria", unit: "diária", unitPrice: 200, description: "Diária completa", materials: [] },
];

const Servicos = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    unit: "m²",
    unitPrice: 0,
    description: "",
  });
  const [newMaterials, setNewMaterials] = useState<Material[]>([]);
  const [expandedService, setExpandedService] = useState<string | null>(null);
   const [editingService, setEditingService] = useState<Service | null>(null);
   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const addMaterial = () => {
     if (editingService) {
       setEditingService({
         ...editingService,
         materials: [
           ...editingService.materials,
           { id: Date.now().toString(), name: "", unit: "un", quantityPerUnit: 1 },
         ],
       });
     } else {
       setNewMaterials([
         ...newMaterials,
         { id: Date.now().toString(), name: "", unit: "un", quantityPerUnit: 1 },
       ]);
     }
  };

  const updateMaterial = (index: number, field: keyof Material, value: string | number) => {
     if (editingService) {
       const updated = [...editingService.materials];
       updated[index] = { ...updated[index], [field]: value };
       setEditingService({ ...editingService, materials: updated });
     } else {
       const updated = [...newMaterials];
       updated[index] = { ...updated[index], [field]: value };
       setNewMaterials(updated);
     }
  };

  const removeMaterial = (index: number) => {
     if (editingService) {
       setEditingService({
         ...editingService,
         materials: editingService.materials.filter((_, i) => i !== index),
       });
     } else {
       setNewMaterials(newMaterials.filter((_, i) => i !== index));
     }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddService = () => {
    const service: Service = {
      id: Date.now().toString(),
      ...newService,
      materials: newMaterials.filter((m) => m.name.trim() !== ""),
    };
    setServices([service, ...services]);
    setNewService({ name: "", category: "", unit: "m²", unitPrice: 0, description: "" });
    setNewMaterials([]);
    setIsDialogOpen(false);
  };

   const handleEditService = (service: Service) => {
     setEditingService({ ...service, materials: [...service.materials] });
     setIsEditDialogOpen(true);
   };
 
   const handleSaveEdit = () => {
     if (!editingService) return;
     setServices(services.map((s) => (s.id === editingService.id ? editingService : s)));
     setEditingService(null);
     setIsEditDialogOpen(false);
   };
 
   const handleDeleteService = (id: string) => {
     setServices(services.filter((s) => s.id !== id));
   };
 
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <AppLayout>
      <PageHeader title="Serviços" description="Cadastre e gerencie seus serviços e valores">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceName">Nome do Serviço *</Label>
                <Input
                  id="serviceName"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="Ex: Assentamento de Piso"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Categoria *</Label>
                  <Select
                    value={newService.category}
                    onValueChange={(value) => setNewService({ ...newService, category: value })}
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
                  <Label>Unidade *</Label>
                  <Select
                    value={newService.unit}
                    onValueChange={(value) => setNewService({ ...newService, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unitPrice">Valor Unitário (R$) *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={newService.unitPrice || ""}
                  onChange={(e) => setNewService({ ...newService, unitPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="0,00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Detalhes do serviço"
                />
              </div>

              {/* Materials Section */}
              <div className="border-t pt-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <Label className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-accent" />
                    Materiais Utilizados
                  </Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
                    <Plus className="mr-1 h-3 w-3" />
                    Adicionar Material
                  </Button>
                </div>
                
                {newMaterials.length > 0 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                      <span className="col-span-5">Material</span>
                      <span className="col-span-3">Unidade</span>
                      <span className="col-span-3">Qtd/{newService.unit || "un"}</span>
                      <span className="col-span-1"></span>
                    </div>
                    {newMaterials.map((material, index) => (
                      <div key={material.id} className="grid grid-cols-12 gap-2 items-center">
                        <Input
                          placeholder="Nome do material"
                          value={material.name}
                          onChange={(e) => updateMaterial(index, "name", e.target.value)}
                          className="col-span-5"
                        />
                        <Select
                          value={material.unit}
                          onValueChange={(value) => updateMaterial(index, "unit", value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {materialUnits.map((u) => (
                              <SelectItem key={u} value={u}>
                                {u}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0"
                          value={material.quantityPerUnit || ""}
                          onChange={(e) => updateMaterial(index, "quantityPerUnit", parseFloat(e.target.value) || 0)}
                          className="col-span-3"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMaterial(index)}
                          className="col-span-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {newMaterials.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">
                    Nenhum material adicionado. Clique em "Adicionar Material" para incluir.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddService} disabled={!newService.name || !newService.category || !newService.unitPrice}>
                Salvar Serviço
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

       {/* Edit Dialog */}
       <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
         setIsEditDialogOpen(open);
         if (!open) setEditingService(null);
       }}>
         <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle>Editar Serviço</DialogTitle>
           </DialogHeader>
           {editingService && (
             <div className="grid gap-4 py-4">
               <div className="grid gap-2">
                 <Label htmlFor="editServiceName">Nome do Serviço *</Label>
                 <Input
                   id="editServiceName"
                   value={editingService.name}
                   onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                   placeholder="Ex: Assentamento de Piso"
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                   <Label>Categoria *</Label>
                   <Select
                     value={editingService.category}
                     onValueChange={(value) => setEditingService({ ...editingService, category: value })}
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
                   <Label>Unidade *</Label>
                   <Select
                     value={editingService.unit}
                     onValueChange={(value) => setEditingService({ ...editingService, unit: value })}
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       {units.map((unit) => (
                         <SelectItem key={unit} value={unit}>
                           {unit}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               <div className="grid gap-2">
                 <Label htmlFor="editUnitPrice">Valor Unitário (R$) *</Label>
                 <Input
                   id="editUnitPrice"
                   type="number"
                   value={editingService.unitPrice || ""}
                   onChange={(e) => setEditingService({ ...editingService, unitPrice: parseFloat(e.target.value) || 0 })}
                   placeholder="0,00"
                 />
               </div>
               <div className="grid gap-2">
                 <Label htmlFor="editDescription">Descrição</Label>
                 <Input
                   id="editDescription"
                   value={editingService.description}
                   onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                   placeholder="Detalhes do serviço"
                 />
               </div>
 
               {/* Materials Section */}
               <div className="border-t pt-4 mt-2">
                 <div className="flex items-center justify-between mb-3">
                   <Label className="flex items-center gap-2">
                     <Package className="h-4 w-4 text-accent" />
                     Materiais Utilizados
                   </Label>
                   <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
                     <Plus className="mr-1 h-3 w-3" />
                     Adicionar Material
                   </Button>
                 </div>
                 
                 {editingService.materials.length > 0 && (
                   <div className="space-y-3">
                     <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                       <span className="col-span-5">Material</span>
                       <span className="col-span-3">Unidade</span>
                       <span className="col-span-3">Qtd/{editingService.unit || "un"}</span>
                       <span className="col-span-1"></span>
                     </div>
                     {editingService.materials.map((material, index) => (
                       <div key={material.id} className="grid grid-cols-12 gap-2 items-center">
                         <Input
                           placeholder="Nome do material"
                           value={material.name}
                           onChange={(e) => updateMaterial(index, "name", e.target.value)}
                           className="col-span-5"
                         />
                         <Select
                           value={material.unit}
                           onValueChange={(value) => updateMaterial(index, "unit", value)}
                         >
                           <SelectTrigger className="col-span-3">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             {materialUnits.map((u) => (
                               <SelectItem key={u} value={u}>
                                 {u}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                         <Input
                           type="number"
                           step="0.01"
                           min="0"
                           placeholder="0"
                           value={material.quantityPerUnit || ""}
                           onChange={(e) => updateMaterial(index, "quantityPerUnit", parseFloat(e.target.value) || 0)}
                           className="col-span-3"
                         />
                         <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           onClick={() => removeMaterial(index)}
                           className="col-span-1 text-destructive hover:text-destructive"
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     ))}
                   </div>
                 )}
                 
                 {editingService.materials.length === 0 && (
                   <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">
                     Nenhum material adicionado. Clique em "Adicionar Material" para incluir.
                   </p>
                 )}
               </div>
             </div>
           )}
           <div className="flex justify-end gap-3">
             <Button variant="outline" onClick={() => {
               setIsEditDialogOpen(false);
               setEditingService(null);
             }}>
               Cancelar
             </Button>
             <Button 
               onClick={handleSaveEdit} 
               disabled={!editingService?.name || !editingService?.category || !editingService?.unitPrice}
             >
               Salvar Alterações
             </Button>
           </div>
         </DialogContent>
       </Dialog>
 
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services Table */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Lista de Serviços ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Unidade</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <>
                  <TableRow 
                    key={service.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {service.materials.length > 0 && (
                          expandedService === service.id 
                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{service.name}</p>
                          {service.description && (
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          )}
                          {service.materials.length > 0 && (
                            <p className="text-xs text-accent mt-1">
                              <Package className="h-3 w-3 inline mr-1" />
                              {service.materials.length} material(is)
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {service.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{service.unit}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(service.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                         <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="text-destructive hover:text-destructive"
                           onClick={() => handleDeleteService(service.id)}
                         >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedService === service.id && service.materials.length > 0 && (
                    <TableRow key={`${service.id}-materials`}>
                      <TableCell colSpan={5} className="bg-muted/30 p-4">
                        <div className="ml-6">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Package className="h-4 w-4 text-accent" />
                            Materiais por {service.unit}:
                          </h4>
                          <div className="grid gap-2">
                            {service.materials.map((material) => (
                              <div 
                                key={material.id} 
                                className="flex items-center justify-between bg-background rounded-lg px-3 py-2 text-sm"
                              >
                                <span className="font-medium">{material.name}</span>
                                <span className="text-muted-foreground">
                                  {material.quantityPerUnit} {material.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Servicos;
