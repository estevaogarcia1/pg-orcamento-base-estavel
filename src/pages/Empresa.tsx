import { useState, useEffect } from "react";
import { Building2, Save } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const COMPANY_STORAGE_KEY = "pg-company-data";
const TERMS_STORAGE_KEY = "pg-terms-data";

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
  instagram: "",
  facebook: "",
  googleBusiness: "",
};

const defaultTerms = `TERMOS E CONDIÇÕES

1. VALIDADE DO ORÇAMENTO
Este orçamento tem validade de 15 (quinze) dias a partir da data de emissão.

2. FORMA DE PAGAMENTO
- 30% de entrada no início da obra
- 40% durante a execução
- 30% na entrega final

3. PRAZO DE EXECUÇÃO
O prazo será definido após aprovação do orçamento e cronograma.

4. GARANTIA
Garantia de 1 (um) ano para vícios de execução.

5. MATERIAIS
Os materiais serão adquiridos conforme especificação aprovada pelo cliente.

6. ALTERAÇÕES
Qualquer alteração no escopo deve ser comunicada por escrito.`;

const Empresa = () => {
   const [company, setCompany] = useState(() => {
     const saved = localStorage.getItem(COMPANY_STORAGE_KEY);
     return saved ? JSON.parse(saved) : defaultCompany;
  });

   const [terms, setTerms] = useState(() => {
     const saved = localStorage.getItem(TERMS_STORAGE_KEY);
     return saved || defaultTerms;
   });

   const handleSaveCompany = () => {
     localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(company));
     toast.success("Dados da empresa salvos com sucesso!");
   };

   const handleSaveTerms = () => {
     localStorage.setItem(TERMS_STORAGE_KEY, terms);
     toast.success("Termos salvos com sucesso!");
   };

  return (
    <AppLayout>
      <PageHeader title="Dados da Empresa" description="Configure as informações da sua empresa" />

      <Tabs defaultValue="dados" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dados">Dados Cadastrais</TabsTrigger>
          <TabsTrigger value="termos">Termos e Condições</TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Estas informações aparecerão nos orçamentos e documentos gerados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <img src={logo} alt="Logo P&G" className="h-20 w-auto" />
                <Button variant="outline">Alterar Logo</Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Razão Social / Nome</Label>
                  <Input
                    id="name"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ / CPF</Label>
                  <Input
                    id="cnpj"
                    value={company.cnpj}
                    onChange={(e) => setCompany({ ...company, cnpj: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    value={company.responsavel}
                    onChange={(e) => setCompany({ ...company, responsavel: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={company.website}
                    onChange={(e) => setCompany({ ...company, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Redes Sociais</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="@seuinstagram"
                      value={company.instagram}
                      onChange={(e) => setCompany({ ...company, instagram: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      placeholder="facebook.com/suapagina"
                      value={company.facebook}
                      onChange={(e) => setCompany({ ...company, facebook: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="googleBusiness">Google Meu Negócio</Label>
                    <Input
                      id="googleBusiness"
                      placeholder="Link do Google Business"
                      value={company.googleBusiness}
                      onChange={(e) => setCompany({ ...company, googleBusiness: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Endereço</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={company.address}
                      onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={company.city}
                      onChange={(e) => setCompany({ ...company, city: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={company.state}
                        onChange={(e) => setCompany({ ...company, state: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={company.cep}
                        onChange={(e) => setCompany({ ...company, cep: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                 <Button onClick={handleSaveCompany}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="termos">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Termos e Condições</CardTitle>
              <CardDescription>
                Este texto aparecerá no rodapé de todos os orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
              <div className="flex justify-end">
                 <Button onClick={handleSaveTerms}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Termos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Empresa;
