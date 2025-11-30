import { Invoice, InvoiceWithoutId } from "../interfaces/invoice.interface";

export type InvoiceWithCustomerId = Omit<Invoice, "customer"> & { customerId: number };

export interface InvoicesStoragePort {
	create(invoice: InvoiceWithoutId, transaction?: unknown): Promise<InvoiceWithCustomerId>;
	getByPublicId(invoicePublicId: string): Promise<InvoiceWithCustomerId | null>;
}
