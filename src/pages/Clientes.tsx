import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Plus, Search, MoreHorizontal, Mail, Phone, MapPin, Users } from "lucide-react";
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
import { EmptyState } from "@/components/ui/empty-state";
console.log("ARQUIVO NOVO CARREGADO");
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cpfCnpj: string;
  createdAt: string;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(51) 99999-1234",
    address: "Rua das Flores, 123",
    city: "Porto Alegre, RS",
    cpfCnpj: "123.456.789-00",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(51) 98888-5678",
    address: "Av. Brasil, 456",
    city: "Canoas, RS",
    cpfCnpj: "987.654.321-00",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    email: "carlos@empresa.com.br",
    phone: "(51) 97777-9012",
    address: "Rua do Comércio, 789",
    city: "Gravataí, RS",
    cpfCnpj: "12.345.678/0001-90",
    createdAt: "2024-01-05",
  },
];

const Clientes = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cpfCnpj: "",
  });

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase())
  );

const handleAddClient = async () => {
  console.log("CLICOU NO BOTÃO");

  const { data, error } = await supabase
    .from("clients")
    .insert([
      {
        name: newClient.name,
        phone: newClient.phone,
        city: newClient.city,
      }
    ])
    .select()
    .single();

  console.log("Resposta do Supabase:", data, error);

  if (error) {
    console.error(error);
    alert("Erro ao salvar cliente");
    return;
  }

  alert("Salvou no banco!");
};

  const client: Client = {
    id: data.id,
    name: data.name,
    email: "",
    phone: data.phone,
    address: "",
    city: data.city,
    cpfCnpj: "",
    createdAt: new Date().toISOString().split("T")[0],
  };

  setClients([client, ...clients]);
  setNewClient({ name: "", email: "", phone: "", address: "", city: "", cpfCnpj: "" });
  setIsDialogOpen(false);
};

  return (
    <AppLayout>
      <PageHeader title="Clientes" description="Gerencie seus clientes e contatos">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="(51) 99999-9999"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input
                  id="cpfCnpj"
                  value={newClient.cpfCnpj}
                  onChange={(e) => setNewClient({ ...newClient, cpfCnpj: e.target.value })}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="Rua, número"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Cidade/Estado</Label>
                <Input
                  id="city"
                  value={newClient.city}
                  onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                  placeholder="Cidade, RS"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => {
                  console.log("BOTÃO FUNCIONOU");
                  handleAddClient();
                }}
                disabled={!newClient.name || !newClient.phone}
              >
                Salvar Cliente
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
            placeholder="Buscar cliente por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente encontrado"
          description="Comece cadastrando seu primeiro cliente para criar orçamentos."
          actionLabel="Cadastrar Cliente"
          onAction={() => setIsDialogOpen(true)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="transition-all hover:shadow-lg animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-semibold text-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.cpfCnpj}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{client.city}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button size="sm" className="flex-1">
                    Ver Orçamentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Clientes;
