import { Customer } from "../../customers/interfaces/customer.interface";

export interface Invoice {
	id: number;
	publicId: string;
	referenceId: string;
	customer: Customer;
	number: string;
	issueDate: Date;
	dueDate: Date;
	items: InvoiceItem[];
	subtotal: number;
	tax: number;
	total: number;
	currency: string;
	status: InvoiceStatus;
	notes?: string;
}

export type InvoiceWithoutId = Omit<Invoice, "id">;

export interface InvoiceItem {
	publicId: string;
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

export enum InvoiceStatus {
	Draft = "draft",
	Sent = "sent",
	Paid = "paid",
	Overdue = "overdue",
	Cancelled = "cancelled",
}
