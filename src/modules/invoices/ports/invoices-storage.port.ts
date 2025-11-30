import { Invoice } from "../interfaces/invoice.interface";

export interface InvoicesStoragePort {
	create(invoice: Invoice, transaction?: unknown): Promise<Invoice>;
}
