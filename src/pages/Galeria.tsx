import { useState, useRef } from "react";
import { Plus, Image, Upload, Trash2, Eye, Camera, ImagePlus, Share2 } from "lucide-react";
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
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/hooks/use-toast";

interface GalleryItem {
  id: string;
  project: string;
  room: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

const rooms = ["Cozinha", "Banheiro", "Quarto", "Sala", "Área Externa", "Escritório", "Lavanderia"];

const mockGallery: GalleryItem[] = [
  {
    id: "1",
    project: "Reforma João Silva",
    room: "Cozinha",
    beforeImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&h=300&fit=crop",
    description: "Reforma completa com troca de piso e bancada",
  },
  {
    id: "2",
    project: "Reforma Maria Santos",
    room: "Banheiro",
    beforeImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop",
    description: "Banheiro suíte com box e bancada nova",
  },
];

const Galeria = () => {
  const [gallery] = useState<GalleryItem[]>(mockGallery);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null);
  
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const beforeCameraRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const afterCameraRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 10MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImages = () => {
    setBeforeImage(null);
    setAfterImage(null);
  };

  const handleShareWhatsApp = async (item: GalleryItem) => {
    const message = `🏠 *${item.project}*\n📍 Ambiente: ${item.room}\n📝 ${item.description}\n\n✅ Confira o resultado do nosso trabalho!\n\n📷 Antes: ${item.beforeImage}\n📷 Depois: ${item.afterImage}`;
    
    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item.project} - ${item.room}`,
          text: message,
        });
        toast({
          title: "Compartilhado!",
          description: "Imagens compartilhadas com sucesso.",
        });
      } catch (error) {
        // User cancelled or share failed, fallback to WhatsApp link
        if ((error as Error).name !== 'AbortError') {
          openWhatsAppLink(message);
        }
      }
    } else {
      openWhatsAppLink(message);
    }
  };

  const openWhatsAppLink = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const [shareDialogItem, setShareDialogItem] = useState<GalleryItem | null>(null);
  const [clientPhone, setClientPhone] = useState("");

  const formatPhoneMask = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) {
      return digits.length ? `(${digits}` : '';
    }
    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneMask(e.target.value);
    setClientPhone(formatted);
  };

  const filteredGallery = selectedRoom === "all" 
    ? gallery 
    : gallery.filter(item => item.room === selectedRoom);

  return (
    <AppLayout>
      <PageHeader title="Galeria" description="Fotos Antes e Depois por ambiente">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Fotos
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Fotos Antes e Depois</DialogTitle>
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
              <div className="grid gap-2">
                <Label>Ambiente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Foto Antes</Label>
                  {beforeImage ? (
                    <div className="relative">
                      <img src={beforeImage} alt="Antes" className="h-32 w-full object-cover rounded-lg" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => setBeforeImage(null)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-16 flex-col gap-1"
                          onClick={() => beforeInputRef.current?.click()}
                        >
                          <ImagePlus className="h-5 w-5" />
                          <span className="text-xs">Galeria</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-16 flex-col gap-1"
                          onClick={() => beforeCameraRef.current?.click()}
                        >
                          <Camera className="h-5 w-5" />
                          <span className="text-xs">Câmera</span>
                        </Button>
                      </div>
                      <input
                        ref={beforeInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setBeforeImage)}
                      />
                      <input
                        ref={beforeCameraRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setBeforeImage)}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Foto Depois</Label>
                  {afterImage ? (
                    <div className="relative">
                      <img src={afterImage} alt="Depois" className="h-32 w-full object-cover rounded-lg" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => setAfterImage(null)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-16 flex-col gap-1"
                          onClick={() => afterInputRef.current?.click()}
                        >
                          <ImagePlus className="h-5 w-5" />
                          <span className="text-xs">Galeria</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-16 flex-col gap-1"
                          onClick={() => afterCameraRef.current?.click()}
                        >
                          <Camera className="h-5 w-5" />
                          <span className="text-xs">Câmera</span>
                        </Button>
                      </div>
                      <input
                        ref={afterInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setAfterImage)}
                      />
                      <input
                        ref={afterCameraRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setAfterImage)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Input placeholder="Descreva o trabalho realizado" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filter */}
      <div className="mb-6">
        <Select value={selectedRoom} onValueChange={setSelectedRoom}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por ambiente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os ambientes</SelectItem>
            {rooms.map((room) => (
              <SelectItem key={room} value={room}>
                {room}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gallery Grid */}
      {filteredGallery.length === 0 ? (
        <EmptyState
          icon={Image}
          title="Nenhuma foto encontrada"
          description="Adicione fotos de antes e depois para mostrar seu trabalho."
          actionLabel="Adicionar Fotos"
          onAction={() => setIsDialogOpen(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGallery.map((item) => (
            <Card key={item.id} className="overflow-hidden animate-fade-in">
              <div className="relative">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img
                      src={item.beforeImage}
                      alt="Antes"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded bg-destructive/80 px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                      Antes
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src={item.afterImage}
                      alt="Depois"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded bg-success/80 px-2 py-0.5 text-xs font-medium text-success-foreground">
                      Depois
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent mb-2">
                      {item.room}
                    </span>
                    <h3 className="font-medium">{item.project}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => setShareDialogItem(item)}
                      title="Compartilhar no WhatsApp"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setViewingItem(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingItem?.project} - {viewingItem?.room}</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2 text-destructive">Antes</p>
                  <img
                    src={viewingItem.beforeImage}
                    alt="Antes"
                    className="rounded-lg w-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-success">Depois</p>
                  <img
                    src={viewingItem.afterImage}
                    alt="Depois"
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setViewingItem(null);
                    setShareDialogItem(viewingItem);
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar no WhatsApp
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Share WhatsApp Dialog */}
      <Dialog open={!!shareDialogItem} onOpenChange={() => setShareDialogItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar no WhatsApp</DialogTitle>
          </DialogHeader>
          {shareDialogItem && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p><strong>Projeto:</strong> {shareDialogItem.project}</p>
                <p><strong>Ambiente:</strong> {shareDialogItem.room}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone do Cliente (opcional)</Label>
                <Input
                  id="clientPhone"
                  placeholder="(51) 99999-9999"
                  value={clientPhone}
                  onChange={handlePhoneChange}
                  maxLength={16}
                />
                <p className="text-xs text-muted-foreground">
                  Deixe em branco para escolher o contato manualmente
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShareDialogItem(null)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const message = `🏠 *${shareDialogItem.project}*\n📍 Ambiente: ${shareDialogItem.room}\n📝 ${shareDialogItem.description}\n\n✅ Confira o resultado do nosso trabalho!\n\n📷 Antes: ${shareDialogItem.beforeImage}\n📷 Depois: ${shareDialogItem.afterImage}`;
                    const encodedMessage = encodeURIComponent(message);
                    const phone = clientPhone.replace(/\D/g, '');
                    const whatsappUrl = phone 
                      ? `https://wa.me/55${phone}?text=${encodedMessage}`
                      : `https://wa.me/?text=${encodedMessage}`;
                    window.open(whatsappUrl, '_blank');
                    setShareDialogItem(null);
                    setClientPhone("");
                    toast({
                      title: "WhatsApp aberto",
                      description: "Complete o envio no WhatsApp.",
                    });
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Galeria;
