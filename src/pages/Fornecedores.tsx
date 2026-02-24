import { useState } from "react";
import { Plus, Search, Phone, Mail, MapPin, Building2, MoreHorizontal } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { EmptyState } from "@/components/ui/empty-state";
import { Truck } from "lucide-react";

interface Supplier {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  category: string;
}

const categories = ["Material de Construção", "Elétrica", "Hidráulica", "Ferramentas", "Acabamentos", "Marcenaria", "Outros"];

const mockSuppliers: Supplier[] = [
  { id: "1", company: "Casa dos Materiais", contact: "Roberto Silva", phone: "(51) 3333-1234", email: "contato@casadosmateriais.com.br", city: "Porto Alegre, RS", category: "Material de Construção" },
  { id: "2", company: "Elétrica Total", contact: "Márcia Santos", phone: "(51) 3333-5678", email: "vendas@eletricatotal.com.br", city: "Canoas, RS", category: "Elétrica" },
  { id: "3", company: "Hidro Center", contact: "José Lima", phone: "(51) 3333-9012", email: "jose@hidrocenter.com.br", city: "Porto Alegre, RS", category: "Hidráulica" },
];

const Fornecedores = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    company: "",
    contact: "",
    phone: "",
    email: "",
    city: "",
    category: "",
  });

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.company.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSupplier = () => {
    const supplier: Supplier = {
      id: Date.now().toString(),
      ...newSupplier,
    };
    setSuppliers([supplier, ...suppliers]);
    setNewSupplier({ company: "", contact: "", phone: "", email: "", city: "", category: "" });
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <PageHeader title="Fornecedores" description="Cadastre e gerencie seus fornecedores">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Cadastrar Fornecedor</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome da Empresa *</Label>
                <Input
                  value={newSupplier.company}
                  onChange={(e) => setNewSupplier({ ...newSupplier, company: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Contato / Vendedor</Label>
                  <Input
                    value={newSupplier.contact}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                    placeholder="Nome do contato"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select
                    value={newSupplier.category}
                    onValueChange={(value) => setNewSupplier({ ...newSupplier, category: value })}
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Telefone</Label>
                  <Input
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    placeholder="(51) 9999-9999"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    placeholder="email@empresa.com"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Cidade</Label>
                <Input
                  value={newSupplier.city}
                  onChange={(e) => setNewSupplier({ ...newSupplier, city: e.target.value })}
                  placeholder="Cidade, RS"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSupplier} disabled={!newSupplier.company}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar fornecedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      {filteredSuppliers.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="Nenhum fornecedor cadastrado"
          description="Cadastre seus fornecedores para facilitar as compras de materiais."
          actionLabel="Cadastrar Fornecedor"
          onAction={() => setIsDialogOpen(true)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="transition-all hover:shadow-lg animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{supplier.company}</h3>
                      <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        {supplier.category}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  {supplier.contact && (
                    <p className="text-muted-foreground">Contato: {supplier.contact}</p>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{supplier.city}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Fornecedores;
