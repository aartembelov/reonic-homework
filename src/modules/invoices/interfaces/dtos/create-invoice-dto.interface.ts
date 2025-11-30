export interface CreateInvoiceDto {
	invoiceId: string;
	invoiceNumber: string;
	customerName: string;
	customerEmail: string;
	customerAddress?: CustomerAddressDto;
	invoiceDate: Date;
	dueDate: Date;
	items: { description: string; quantity: number; unitPrice: number; total: number }[];
	subtotal: number;
	tax: number;
	total: number;
	currency?: string;
	status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
	notes?: string;
}

export interface CustomerAddressDto {
	street?: string;
	city?: string;
	postalCode?: string;
	country?: string;
}
