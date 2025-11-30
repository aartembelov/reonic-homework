export interface CreateInvoiceRequest {
	invoiceId: string;
	invoiceNumber: string;
	customerName: string;
	customerEmail: string;
	customerAddress?: {
		street?: string;
		city?: string;
		postalCode?: string;
		country?: string;
	};
	invoiceDate: string;
	dueDate: string;
	items: { description: string; quantity: number; unitPrice: number; total: number }[];
	subtotal: number;
	tax: number;
	total: number;
	currency?: string;
	status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
	notes?: string;
}
