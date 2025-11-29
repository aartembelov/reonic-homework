import { Inject, Injectable } from "@nestjs/common";
import { InvoicesStoragePort } from "./ports/invoices-storage.port";
import { Invoice } from "./interfaces/invoice.interface";

export const INVOICES_STORAGE_TOKEN = Symbol.for("INVOICES_STORAGE_TOKEN");

interface CreateInvoiceDto {}

@Injectable()
export class InvoicesService {
	constructor(@Inject(INVOICES_STORAGE_TOKEN) private readonly invoicesStorage: InvoicesStoragePort) {}

	async create(invoice: CreateInvoiceDto): Promise<Invoice> {
		throw new Error("Method not implemented");
	}
}
