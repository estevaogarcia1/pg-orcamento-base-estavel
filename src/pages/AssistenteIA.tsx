import { useState } from "react";
import { Bot, Search, Sparkles, DollarSign, Calendar, ClipboardCheck, MessageSquare } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const aiTools = [
  {
    id: "cronograma",
    icon: Calendar,
    title: "Gerar Cronograma",
    description: "Crie um cronograma de obra automático baseado no orçamento aprovado",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "precos",
    icon: DollarSign,
    title: "Consultar Preços RS",
    description: "Busque valores de mão de obra e materiais praticados na região do RS",
    color: "bg-success/10 text-success",
  },
  {
    id: "checklist",
    icon: ClipboardCheck,
    title: "Criar Checklist",
    description: "Gere um checklist de entrega personalizado para o tipo de obra",
    color: "bg-accent/10 text-accent",
  },
  {
    id: "sugestoes",
    icon: Sparkles,
    title: "Sugestões Inteligentes",
    description: "Receba sugestões de serviços adicionais baseados no projeto",
    color: "bg-warning/10 text-warning",
  },
];

const AssistenteIA = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    setResponse("");
    
    // Set default prompts
    switch (toolId) {
      case "cronograma":
        setPrompt("Gere um cronograma detalhado para uma reforma de cozinha completa com prazo de 30 dias.");
        break;
      case "precos":
        setPrompt("Quais são os valores médios de mão de obra para assentamento de piso cerâmico em Porto Alegre?");
        break;
      case "checklist":
        setPrompt("Crie um checklist de entrega para uma reforma de banheiro completa.");
        break;
      case "sugestoes":
        setPrompt("Sugira serviços adicionais para uma reforma de apartamento de 70m².");
        break;
    }
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      setResponse(`## Resposta do Assistente IA

Com base na sua solicitação, aqui está uma análise detalhada:

### Recomendações

1. **Primeira etapa**: Preparação e demolição (5 dias)
2. **Segunda etapa**: Infraestrutura elétrica e hidráulica (7 dias)
3. **Terceira etapa**: Acabamentos (10 dias)
4. **Quarta etapa**: Instalações finais e limpeza (3 dias)

### Observações Importantes

- Considere uma margem de 10-15% no prazo para imprevistos
- Verifique a disponibilidade de materiais com antecedência
- Mantenha comunicação constante com o cliente

*Esta é uma sugestão gerada por IA. Revise e ajuste conforme necessário.*`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Assistente IA" 
        description="Ferramentas inteligentes para auxiliar em suas reformas"
      />

      {/* AI Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {aiTools.map((tool) => (
          <Card
            key={tool.id}
            className={`cursor-pointer transition-all hover:shadow-lg animate-fade-in ${
              selectedTool === tool.id ? "ring-2 ring-accent" : ""
            }`}
            onClick={() => handleToolClick(tool.id)}
          >
            <CardContent className="pt-6">
              <div className={`inline-flex rounded-lg p-3 ${tool.color}`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">{tool.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat Interface */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-accent" />
            Chat com Assistente
          </CardTitle>
          <CardDescription>
            Selecione uma ferramenta acima ou faça uma pergunta direta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Digite sua pergunta ou descreva o que precisa..."
              rows={3}
              className="flex-1"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSend} disabled={isLoading || !prompt.trim()}>
              {isLoading ? (
                <>
                  <Bot className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </div>

          {/* Response Area */}
          {response && (
            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full bg-accent p-2">
                  <Bot className="h-4 w-4 text-accent-foreground" />
                </div>
                <span className="font-medium">Assistente P&G</span>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm">{response}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 animate-fade-in border-accent/20 bg-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-accent/10 p-3">
              <Bot className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Sobre o Assistente IA</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                O Assistente IA da P&G Reformas utiliza inteligência artificial para ajudar você a 
                criar cronogramas, buscar preços atualizados da região do Rio Grande do Sul, 
                gerar checklists de entrega e muito mais. Todas as sugestões devem ser revisadas 
                antes de aplicar ao projeto final.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default AssistenteIA;
