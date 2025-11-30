import { Invoice } from "../interfaces/invoice.interface";

export interface InvoiceFilters {
	dueDate?: string;
	invoiceDate?: string;
	dueDateFrom?: string;
	dueDateTo?: string;
	invoiceDateFrom?: string;
	invoiceDateTo?: string;
}

export interface InvoicesStoragePort {
	create(invoice: Invoice, transaction?: unknown): Promise<Invoice>;
	getByPublicId(invoicePublicId: string, transaction?: unknown): Promise<Invoice | null>;
	getByReferenceId(referenceId: string, transaction?: unknown): Promise<Invoice | null>;
	getByCustomerName(customerName: string, filters?: InvoiceFilters, transaction?: unknown): Promise<Invoice[]>;
	getWithFilters(filters: InvoiceFilters, transaction?: unknown): Promise<Invoice[]>;
}
