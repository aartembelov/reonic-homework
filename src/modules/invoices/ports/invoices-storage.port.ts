import { Page } from "../../../shared/pagination/interfaces/page.interface";
import { PaginationParameters } from "../../../shared/pagination/interfaces/pagination-parameters.interface";
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
	getByCustomerName(
		customerName: string,
		options: { filters?: InvoiceFilters; pagination: PaginationParameters; transaction?: unknown }
	): Promise<Page<Invoice>>;
	getWithFilters(
		filters: InvoiceFilters,
		options: {
			pagination: PaginationParameters;
			transaction?: unknown;
		}
	): Promise<Page<Invoice>>;
}
