import { Invoice } from "../interfaces/invoice.interface";

export interface InvoicesStoragePort {
	create(invoice: Invoice): Promise<Invoice>;
}
