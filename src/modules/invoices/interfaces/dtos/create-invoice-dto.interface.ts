export interface CreateInvoiceDto {
	referenceId: string;
	number: string;
	customer: {
		name: string;
		email: string;
		address?: CustomerAddressDto;
	};
	issueDate: Date;
	dueDate: Date;
	items: CreateInvoiceItemDto[];
	subtotal: number;
	tax: number;
	total: number;
	currency?: string;
	status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
	notes?: string;
}

export interface CreateInvoiceItemDto {
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

export interface CustomerAddressDto {
	street?: string;
	city?: string;
	postalCode?: string;
	country?: string;
}
