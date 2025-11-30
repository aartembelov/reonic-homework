import { Invoice, InvoiceWithoutId } from "../interfaces/invoice.interface";

export interface InvoicesStoragePort {
	create(invoice: InvoiceWithoutId, transaction?: unknown): Promise<Invoice>;
	getByPublicId(invoicePublicId: string): Promise<Invoice | null>;
	getByReferenceId(referenceId: string): Promise<Invoice | null>;
}
