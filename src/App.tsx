import { supabase } from "./lib/supabase"

function App() {

  async function salvarClienteTeste() {
    const { data, error } = await supabase
      .from("clients")
      .insert([
        {
          name: "Cliente Teste",
          phone: "999999999",
          city: "Porto Alegre"
        }
      ])

    if (error) {
      console.error("Erro:", error)
      alert("Erro ao salvar cliente")
    } else {
      console.log("Salvo:", data)
      alert("Cliente salvo com sucesso!")
    }
  }

  return (
    <div>
      <h1>Teste Supabase</h1>

      <button onClick={salvarClienteTeste}>
        Salvar Cliente Teste
      </button>
    </div>
  )
}

export default App
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/layout/AppSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Servicos from "./pages/Servicos";
import Orcamentos from "./pages/Orcamentos";
import NovoOrcamento from "./pages/NovoOrcamento";
import Cronograma from "./pages/Cronograma";
import Agenda from "./pages/Agenda";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Galeria from "./pages/Galeria";
import Ferramentas from "./pages/Ferramentas";
import Checklist from "./pages/Checklist";
import Fornecedores from "./pages/Fornecedores";
import Profissionais from "./pages/Profissionais";
import AssistenteIA from "./pages/AssistenteIA";
import Empresa from "./pages/Empresa";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/clientes" element={<Clientes />} />
                      <Route path="/servicos" element={<Servicos />} />
                      <Route path="/orcamentos" element={<Orcamentos />} />
                      <Route path="/orcamentos/novo" element={<NovoOrcamento />} />
                      <Route path="/cronograma" element={<Cronograma />} />
                      <Route path="/agenda" element={<Agenda />} />
                      <Route path="/financeiro" element={<Financeiro />} />
                      <Route path="/relatorios" element={<Relatorios />} />
                      <Route path="/galeria" element={<Galeria />} />
                      <Route path="/ferramentas" element={<Ferramentas />} />
                      <Route path="/checklist" element={<Checklist />} />
                      <Route path="/fornecedores" element={<Fornecedores />} />
                      <Route path="/profissionais" element={<Profissionais />} />
                      <Route path="/assistente-ia" element={<AssistenteIA />} />
                      <Route path="/empresa" element={<Empresa />} />
                      <Route path="/configuracoes" element={<Configuracoes />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
