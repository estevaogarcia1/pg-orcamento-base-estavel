import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Bot, Calculator, Save, Send, Eye, Clock, CreditCard, Package, ChevronDown, ChevronUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BudgetDialog } from "@/components/budget/BudgetDialog";

interface BudgetMaterial {
  name: string;
  unit: string;
  quantity: number;
}

interface BudgetItem {
  id: string;
  service: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  materials: BudgetMaterial[];
}

interface PaymentSchedule {
  description: string;
  percentage: number;
  value: number;
}

const mockClients = [
  { id: "1", name: "João Silva", phone: "(51) 98888-1111", email: "joao@email.com", address: "Rua A, 123 - Porto Alegre/RS" },
  { id: "2", name: "Maria Santos", phone: "(51) 98888-2222", email: "maria@email.com", address: "Av. B, 456 - Canoas/RS" },
  { id: "3", name: "Carlos Oliveira", phone: "(51) 98888-3333", email: "carlos@email.com", address: "Rua C, 789 - Gravataí/RS" },
];

interface ServiceMaterial {
  id: string;
  name: string;
  unit: string;
  quantityPerUnit: number;
}

interface ServiceOption {
  id: string;
  name: string;
  unit: string;
  price: number;
  materials: ServiceMaterial[];
}

const mockServices: ServiceOption[] = [
  { 
    id: "1", 
    name: "Assentamento de Piso Cerâmico", 
    unit: "m²", 
    price: 45,
    materials: [
      { id: "m1", name: "Argamassa AC-II", unit: "kg", quantityPerUnit: 5 },
      { id: "m2", name: "Espaçadores 2mm", unit: "un", quantityPerUnit: 20 },
      { id: "m3", name: "Rejunte", unit: "kg", quantityPerUnit: 0.5 },
    ]
  },
  { 
    id: "2", 
    name: "Pintura Látex PVA", 
    unit: "m²", 
    price: 18,
    materials: [
      { id: "m4", name: "Tinta Látex PVA", unit: "litro", quantityPerUnit: 0.2 },
      { id: "m5", name: "Massa Corrida", unit: "kg", quantityPerUnit: 0.3 },
      { id: "m6", name: "Lixa 150", unit: "un", quantityPerUnit: 0.1 },
    ]
  },
  { 
    id: "3", 
    name: "Instalação de Ponto Elétrico", 
    unit: "un", 
    price: 120,
    materials: [
      { id: "m7", name: "Cabo 2,5mm", unit: "m", quantityPerUnit: 10 },
      { id: "m8", name: "Caixa 4x2", unit: "un", quantityPerUnit: 1 },
      { id: "m9", name: "Tomada 10A", unit: "un", quantityPerUnit: 1 },
    ]
  },
  { 
    id: "4", 
    name: "Instalação de Ponto Hidráulico", 
    unit: "un", 
    price: 180,
    materials: [
      { id: "m10", name: "Tubo PVC 25mm", unit: "m", quantityPerUnit: 3 },
      { id: "m11", name: "Joelho 90° 25mm", unit: "un", quantityPerUnit: 2 },
      { id: "m12", name: "Cola para PVC", unit: "un", quantityPerUnit: 0.1 },
    ]
  },
  { 
    id: "5", 
    name: "Forro de Gesso", 
    unit: "m²", 
    price: 65,
    materials: [
      { id: "m13", name: "Placa de Gesso", unit: "m²", quantityPerUnit: 1.1 },
      { id: "m14", name: "Arame Galvanizado", unit: "m", quantityPerUnit: 2 },
      { id: "m15", name: "Prego", unit: "un", quantityPerUnit: 4 },
    ]
  },
];

const defaultCompany = {
  name: "P&G Construções e Reformas",
  cnpj: "12.345.678/0001-90",
  phone: "(51) 99999-9999",
  email: "contato@pgreformas.com.br",
  address: "Rua das Obras, 123",
  city: "Porto Alegre",
  state: "RS",
  cep: "90000-000",
  website: "www.pgreformas.com.br",
  responsavel: "Pedro Gonçalves",
  instagram: "@pgreformas",
  googleBusiness: "P&G Construções",
};

const defaultTerms = `TERMOS E CONDIÇÕES

1. VALIDADE DO ORÇAMENTO
Este orçamento tem validade de 15 (quinze) dias a partir da data de emissão.

2. FORMA DE PAGAMENTO
Conforme condições descritas acima.

3. PRAZO DE EXECUÇÃO
O prazo será definido após aprovação do orçamento e cronograma.

4. GARANTIA
Garantia de 1 (um) ano para vícios de execução.

5. MATERIAIS
Os materiais serão adquiridos conforme especificação aprovada pelo cliente.

6. ALTERAÇÕES
Qualquer alteração no escopo deve ser comunicada por escrito.`;

const NovoOrcamento = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [showPreview, setShowPreview] = useState(false);
  
  // Execution time
  const [executionTime, setExecutionTime] = useState("30 dias úteis");
  
  // Payment schedule
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([
    { description: "Entrada (início da obra)", percentage: 30, value: 0 },
    { description: "Após 15 dias de trabalho", percentage: 40, value: 0 },
    { description: "Na entrega final", percentage: 30, value: 0 },
  ]);

  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // AI-generated schedule (editable)
  const [schedule, setSchedule] = useState<{ task: string; week: string }[]>([]);

  const addItem = () => {
    const service = mockServices.find((s) => s.id === selectedService);
    if (!service) return;

    // Calculate materials based on quantity
    const calculatedMaterials: BudgetMaterial[] = service.materials.map((m) => ({
      name: m.name,
      unit: m.unit,
      quantity: Math.ceil(m.quantityPerUnit * quantity * 100) / 100,
    }));

    const newItem: BudgetItem = {
      id: Date.now().toString(),
      service: service.name,
      description: "",
      unit: service.unit,
      quantity,
      unitPrice: service.price,
      total: quantity * service.price,
      materials: calculatedMaterials,
    };

    setItems([...items, newItem]);
    setSelectedService("");
    setQuantity(1);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItemQuantity = (id: string, newQuantity: number) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        
        // Find original service to recalculate materials
        const service = mockServices.find((s) => s.name === item.service);
        const updatedMaterials = service?.materials.map((m) => ({
          name: m.name,
          unit: m.unit,
          quantity: Math.ceil(m.quantityPerUnit * newQuantity * 100) / 100,
        })) || item.materials;

        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.unitPrice,
          materials: updatedMaterials,
        };
      })
    );
  };

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const total = subtotal;

  // Update payment values when total changes
  const calculatedPaymentSchedule = paymentSchedule.map((payment) => ({
    ...payment,
    value: (total * payment.percentage) / 100,
  }));

  const updatePaymentPercentage = (index: number, percentage: number) => {
    const updated = [...paymentSchedule];
    updated[index].percentage = percentage;
    setPaymentSchedule(updated);
  };

  const addPaymentStep = () => {
    setPaymentSchedule([
      ...paymentSchedule,
      { description: "Nova etapa", percentage: 0, value: 0 },
    ]);
  };

  const removePaymentStep = (index: number) => {
    setPaymentSchedule(paymentSchedule.filter((_, i) => i !== index));
  };

  const updatePaymentDescription = (index: number, description: string) => {
    const updated = [...paymentSchedule];
    updated[index].description = description;
    setPaymentSchedule(updated);
  };

  const selectedClientData = mockClients.find((c) => c.id === selectedClient);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <AppLayout>
      <PageHeader title="Novo Orçamento" description="Crie um novo orçamento para seu cliente">
        <Button variant="outline" onClick={() => navigate("/orcamentos")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Project Info */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Informações do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cliente *</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Nome do Projeto *</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Ex: Reforma Cozinha Completa"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço da Obra</Label>
                <Input
                  id="address"
                  value={projectAddress}
                  onChange={(e) => setProjectAddress(e.target.value)}
                  placeholder="Endereço completo da obra"
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-accent" />
                Itens do Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-2">
                  <Label>Serviço</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {formatCurrency(service.price)}/{service.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32 space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  />
                </div>
                <Button onClick={addItem} disabled={!selectedService}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>

              {items.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serviço</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-center">Und</TableHead>
                      <TableHead className="text-right">Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <>
                        <TableRow 
                          key={item.id}
                          className={item.materials.length > 0 ? "cursor-pointer hover:bg-muted/50" : ""}
                          onClick={() => item.materials.length > 0 && setExpandedItem(expandedItem === item.id ? null : item.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {item.materials.length > 0 && (
                                expandedItem === item.id 
                                  ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                  : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <span>{item.service}</span>
                                {item.materials.length > 0 && (
                                  <span className="block text-xs text-accent mt-0.5">
                                    <Package className="h-3 w-3 inline mr-1" />
                                    {item.materials.length} material(is)
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItemQuantity(item.id, parseFloat(e.target.value) || 1)
                              }
                              className="w-20 text-center"
                            />
                          </TableCell>
                          <TableCell className="text-center">{item.unit}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.total)}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedItem === item.id && item.materials.length > 0 && (
                          <TableRow key={`${item.id}-materials`}>
                            <TableCell colSpan={6} className="bg-muted/30 p-4">
                              <div className="ml-6">
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                  <Package className="h-4 w-4 text-accent" />
                                  Lista de Materiais para {item.quantity} {item.unit}:
                                </h4>
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                  {item.materials.map((material, index) => (
                                    <div 
                                      key={index} 
                                      className="flex items-center justify-between bg-background rounded-lg px-3 py-2 text-sm"
                                    >
                                      <span className="font-medium">{material.name}</span>
                                      <span className="text-muted-foreground whitespace-nowrap ml-2">
                                        {material.quantity} {material.unit}
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
              )}
            </CardContent>
          </Card>

          {/* Execution Time */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Prazo de Execução
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="executionTime">Tempo estimado</Label>
                <Input
                  id="executionTime"
                  value={executionTime}
                  onChange={(e) => setExecutionTime(e.target.value)}
                  placeholder="Ex: 30 dias úteis"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Schedule */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent" />
                Condições de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentSchedule.map((payment, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={payment.description}
                    onChange={(e) => updatePaymentDescription(index, e.target.value)}
                    placeholder="Descrição"
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={payment.percentage}
                      onChange={(e) =>
                        updatePaymentPercentage(index, parseFloat(e.target.value) || 0)
                      }
                      className="w-16 text-center"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <span className="w-28 text-right font-medium">
                    {formatCurrency((total * payment.percentage) / 100)}
                  </span>
                  {paymentSchedule.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePaymentStep(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addPaymentStep}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Etapa
              </Button>
              <div className="flex justify-between pt-2 border-t font-medium">
                <span>Total das parcelas:</span>
                <span className={paymentSchedule.reduce((acc, p) => acc + p.percentage, 0) === 100 ? "text-green-600" : "text-destructive"}>
                  {paymentSchedule.reduce((acc, p) => acc + p.percentage, 0)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* AI-Generated Schedule */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent" />
                Cronograma de Execução
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedule.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  <p className="text-sm">Clique em "Gerar Cronograma com IA" para criar um cronograma automático baseado nos itens do orçamento.</p>
                </div>
              ) : (
                <>
                  {schedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        value={item.task}
                        onChange={(e) => {
                          const updated = [...schedule];
                          updated[index].task = e.target.value;
                          setSchedule(updated);
                        }}
                        placeholder="Etapa"
                        className="flex-1"
                      />
                      <Input
                        value={item.week}
                        onChange={(e) => {
                          const updated = [...schedule];
                          updated[index].week = e.target.value;
                          setSchedule(updated);
                        }}
                        placeholder="Semana"
                        className="w-32"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSchedule(schedule.filter((_, i) => i !== index))}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSchedule([...schedule, { task: "", week: "" }])}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Etapa
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <Card className="animate-fade-in sticky top-6">
            <CardHeader>
              <CardTitle>Resumo do Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Itens</span>
                  <span>{items.length}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-accent">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  disabled={items.length === 0 || !selectedClient}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar / Imprimir
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => {
                    // Generate mock schedule based on items
                    const mockSchedule = items.map((item, index) => ({
                      task: item.service,
                      week: `Semana ${index + 1}`,
                    }));
                    setSchedule(mockSchedule.length > 0 ? mockSchedule : [
                      { task: "Preparação e mobilização", week: "Semana 1" },
                      { task: "Execução principal", week: "Semana 2-3" },
                      { task: "Acabamentos e limpeza", week: "Semana 4" },
                    ]);
                  }}
                  disabled={items.length === 0}
                >
                  <Bot className="mr-2 h-4 w-4" />
                  Gerar Cronograma com IA
                </Button>
                <Button className="w-full" variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Rascunho
                </Button>
                <Button className="w-full" disabled={items.length === 0 || !selectedClient}>
                  <Send className="mr-2 h-4 w-4" />
                  Finalizar e Enviar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Budget Preview Dialog */}
      {selectedClientData && (
        <BudgetDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          budgetNumber="001"
          company={defaultCompany}
          client={{
            name: selectedClientData.name,
            phone: selectedClientData.phone,
            email: selectedClientData.email,
            address: selectedClientData.address,
          }}
          project={{
            name: projectName || "Projeto sem nome",
            address: projectAddress,
          }}
          items={items}
          executionTime={executionTime}
          paymentSchedule={calculatedPaymentSchedule}
          terms={defaultTerms}
          schedule={schedule}
        />
      )}
    </AppLayout>
  );
};

export default NovoOrcamento;
