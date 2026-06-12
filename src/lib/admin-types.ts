export type LineItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

export type PaymentMilestone = {
  label: string;
  description: string;
  amount: number;
};

export type DocumentFormData = {
  type: "INVOICE" | "QUOTATION";
  number: string;
  clientId: string;
  projectName: string;
  currency: "LKR" | "USD";
  issueDate: string;
  dueDate?: string | null;
  validUntil?: string | null;
  lineItems: LineItem[];
  subtotal: number;
  total: number;
  paymentSchedule: PaymentMilestone[];
  notes?: string | null;
  status: string;
};

export function parseLineItems(value: unknown): LineItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => ({
    description: String(item.description ?? ""),
    quantity: Number(item.quantity ?? 0),
    rate: Number(item.rate ?? 0),
    amount: Number(item.amount ?? 0),
  }));
}

export function parsePaymentSchedule(value: unknown): PaymentMilestone[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => ({
    label: String(item.label ?? ""),
    description: String(item.description ?? ""),
    amount: Number(item.amount ?? 0),
  }));
}

export function formatCurrency(amount: number, currency: string) {
  const code = currency === "USD" ? "USD" : "LKR";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function publicDocumentUrl(type: string, id: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://coreframe.agency";
  const segment = type === "QUOTATION" ? "quotation" : "invoice";
  return `${base}/${segment}/${id}`;
}
