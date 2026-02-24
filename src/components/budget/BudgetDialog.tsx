import { useRef } from "react";
import { X, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BudgetPreview } from "./BudgetPreview";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface ScheduleItem {
  task: string;
  week: string;
}

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetNumber?: string;
  company: {
    name: string;
    cnpj: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    cep: string;
    website: string;
    responsavel: string;
    instagram?: string;
    googleBusiness?: string;
  };
  client: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  project: {
    name: string;
    address: string;
  };
  items: BudgetItem[];
  executionTime: string;
  paymentSchedule: PaymentSchedule[];
  terms: string;
  schedule?: ScheduleItem[];
}

export const BudgetDialog = ({
  open,
  onOpenChange,
  budgetNumber,
  company,
  client,
  project,
  items,
  executionTime,
  paymentSchedule,
  terms,
  schedule = [],
}: BudgetDialogProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Orçamento - ${project.name}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              color: #000;
              background: #fff;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[95vh] p-0">
        <DialogHeader className="p-4 border-b flex-row items-center justify-between">
          <DialogTitle>Pré-visualização do Orçamento</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Download className="mr-2 h-4 w-4" />
              Salvar PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(95vh-80px)]">
          <div className="p-4 bg-gray-100">
            <BudgetPreview
              ref={printRef}
              budgetNumber={budgetNumber}
              company={company}
              client={client}
              project={project}
              items={items}
              executionTime={executionTime}
              paymentSchedule={paymentSchedule}
              terms={terms}
              schedule={schedule}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
