import { Invoice, InvoiceWithoutId } from "../interfaces/invoice.interface";

export interface InvoicesStoragePort {
	create(invoice: InvoiceWithoutId, transaction?: unknown): Promise<Invoice>;
}
