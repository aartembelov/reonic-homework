import { InvoiceStatus } from "../invoice.interface";

export interface InvoiceResponse {
	id: string;
	invoiceId: string;
	invoiceNumber: string;
	customer: {
		id: string;
		name: string;
		email: string;
		address?: { publicId: string; street?: string; city?: string; postal_code?: string; country?: string };
	};
	invoiceDate: string;
	dueDate: string;
	items: { id: string; description: string; quantity: number; unitPrice: number; total: number }[];
	subtotal: number;
	tax: number;
	total: number;
	currency: string;
	status: InvoiceStatus;
	notes?: string;
}
