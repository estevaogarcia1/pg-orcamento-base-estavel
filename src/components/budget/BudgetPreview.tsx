import { forwardRef } from "react";
import logo from "@/assets/logo.png";

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

interface BudgetPreviewProps {
  budgetNumber?: string;
  date?: string;
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
    facebook?: string;
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const BudgetPreview = forwardRef<HTMLDivElement, BudgetPreviewProps>(
  (
    {
      budgetNumber = "001",
      date = new Date().toLocaleDateString("pt-BR"),
      company,
      client,
      project,
      items,
      executionTime,
      paymentSchedule,
      terms,
      schedule = [],
    },
    ref
  ) => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const total = subtotal;

    return (
      <div
        ref={ref}
        className="bg-white text-black p-8 w-[210mm] min-h-[297mm] mx-auto print:p-0 print:shadow-none shadow-lg"
        style={{ fontFamily: "Arial, sans-serif", fontSize: "11pt" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-[#1e3a5f] pb-4 mb-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-24 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-[#1e3a5f]">{company.name}</h1>
              <p className="text-sm text-gray-600">CNPJ: {company.cnpj}</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-[#1e3a5f]">ORÇAMENTO Nº {budgetNumber}</p>
            <p className="text-gray-600">Data: {date}</p>
          </div>
        </div>

        {/* Client Info - Centered */}
        <div className="mb-4 bg-gray-50 p-3 rounded text-sm text-center">
          <span className="font-semibold">{client.name}</span>
          {client.address && <><span className="mx-2">|</span><span>{client.address}</span></>}
          {client.phone && <><span className="mx-2">|</span><span>{client.phone}</span></>}
        </div>

        {/* Project Info */}
        <div className="mb-4 bg-[#1e3a5f] text-white p-2 rounded text-sm">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold">PROJETO:</span> {project.name}
            </div>
            <div>
              <span className="font-bold">LOCAL:</span> {project.address || "A definir"}
            </div>
          </div>
        </div>

        {/* Items Table - Without Unit Price */}
        <div className="mb-4">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                <th className="border border-gray-300 p-1.5 text-left w-10">Item</th>
                <th className="border border-gray-300 p-1.5 text-left">Descrição</th>
                <th className="border border-gray-300 p-1.5 text-center w-14">Qtd</th>
                <th className="border border-gray-300 p-1.5 text-center w-12">Und</th>
                <th className="border border-gray-300 p-1.5 text-right w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 p-1.5 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-1.5">{item.service}</td>
                  <td className="border border-gray-300 p-1.5 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 p-1.5 text-center">{item.unit}</td>
                  <td className="border border-gray-300 p-1.5 text-right font-semibold">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#f97316] text-white font-bold">
                <td colSpan={4} className="border border-gray-300 p-1.5 text-right">
                  VALOR TOTAL:
                </td>
                <td className="border border-gray-300 p-1.5 text-right text-sm">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Materials List */}
        {items.some((item) => item.materials && item.materials.length > 0) && (
          <div className="mb-4">
            <h3 className="font-bold text-[#1e3a5f] mb-2 text-xs uppercase tracking-wide">
              Lista de Materiais
            </h3>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-1.5 text-left">Serviço</th>
                  <th className="border border-gray-300 p-1.5 text-left">Material</th>
                  <th className="border border-gray-300 p-1.5 text-center w-20">Quantidade</th>
                  <th className="border border-gray-300 p-1.5 text-center w-16">Unidade</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) =>
                  item.materials && item.materials.length > 0
                    ? item.materials.map((material, mIndex) => (
                        <tr
                          key={`${item.id}-${mIndex}`}
                          className={mIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          {mIndex === 0 ? (
                            <td
                              className="border border-gray-300 p-1.5 font-medium"
                              rowSpan={item.materials.length}
                            >
                              {item.service} ({item.quantity} {item.unit})
                            </td>
                          ) : null}
                          <td className="border border-gray-300 p-1.5">{material.name}</td>
                          <td className="border border-gray-300 p-1.5 text-center font-semibold">
                            {material.quantity}
                          </td>
                          <td className="border border-gray-300 p-1.5 text-center">
                            {material.unit}
                          </td>
                        </tr>
                      ))
                    : null
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Schedule - AI Generated */}
        {schedule.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-[#1e3a5f] mb-2 text-xs uppercase tracking-wide">
              Cronograma de Execução
            </h3>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-1.5 text-left">Etapa</th>
                  <th className="border border-gray-300 p-1.5 text-center w-24">Período</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 p-1.5">{item.task}</td>
                    <td className="border border-gray-300 p-1.5 text-center font-medium">{item.week}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Execution Time & Payment Schedule */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-gray-300 rounded p-3">
            <h3 className="font-bold text-[#1e3a5f] mb-1 text-xs uppercase tracking-wide">
              Prazo de Execução
            </h3>
            <p className="text-sm font-semibold text-[#f97316]">{executionTime}</p>
          </div>
          <div className="border border-gray-300 rounded p-3">
            <h3 className="font-bold text-[#1e3a5f] mb-1 text-xs uppercase tracking-wide">
              Condições de Pagamento
            </h3>
            <div className="space-y-0.5 text-xs">
              {paymentSchedule.map((payment, index) => (
                <div key={index} className="flex justify-between">
                  <span>{payment.description} ({payment.percentage}%)</span>
                  <span className="font-semibold">{formatCurrency(payment.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms - 2 Columns */}
        <div className="mb-4 border-t-2 border-[#1e3a5f] pt-3">
          <h3 className="font-bold text-[#1e3a5f] mb-1 text-xs uppercase tracking-wide">
            Termos e Condições
          </h3>
          <p className="text-[10px] whitespace-pre-line text-gray-600 leading-tight columns-2 gap-4">{terms}</p>
        </div>

        {/* Signature */}
        <div className="grid grid-cols-2 gap-8 mt-6 pt-3">
          <div className="text-center">
            <div className="border-t border-black pt-2 mx-6">
              <p className="font-semibold text-sm">{company.responsavel}</p>
              <p className="text-xs text-gray-600">{company.name}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2 mx-6">
              <p className="font-semibold text-sm">{client.name}</p>
              <p className="text-xs text-gray-600">Contratante</p>
            </div>
          </div>
        </div>

        {/* Footer with Social Links */}
        <div className="mt-6 pt-3 border-t border-gray-300 text-center text-xs text-gray-500">
          <p>{company.name} | Tel: {company.phone} | {company.email}</p>
          <div className="mt-1 flex items-center justify-center gap-4 flex-wrap">
            {company.website && <span>🌐 {company.website}</span>}
            {company.instagram && <span>📷 {company.instagram}</span>}
            {company.facebook && <span>📘 {company.facebook}</span>}
            {company.googleBusiness && <span>📍 {company.googleBusiness}</span>}
          </div>
        </div>
      </div>
    );
  }
);

BudgetPreview.displayName = "BudgetPreview";
