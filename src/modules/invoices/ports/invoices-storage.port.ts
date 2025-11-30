import { Invoice } from "../interfaces/invoice.interface";

export interface InvoiceFilters {
	dueDate?: Date;
	issueDate?: Date;
	dueDateFrom?: Date;
	dueDateTo?: Date;
	issueDateFrom?: Date;
	issueDateTo?: Date;
}

export interface InvoicesStoragePort {
	create(invoice: Invoice, transaction?: unknown): Promise<Invoice>;
	getByPublicId(invoicePublicId: string, transaction?: unknown): Promise<Invoice | null>;
	getByReferenceId(referenceId: string, transaction?: unknown): Promise<Invoice | null>;
	getByCustomerName(customerName: string, filters?: InvoiceFilters, transaction?: unknown): Promise<Invoice[]>;
	getWithFilters(filters: InvoiceFilters, transaction?: unknown): Promise<Invoice[]>;
}
