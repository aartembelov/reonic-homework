import { Inject, Injectable, Logger } from "@nestjs/common";
import { InvoicesStoragePort } from "./ports/invoices-storage.port";
import { Invoice } from "./interfaces/invoice.interface";
import { CreateInvoiceDto } from "./interfaces/dtos/create-invoice-dto.interface";
import { InvoicesDomainService } from "./invoices.domain.service";
import { TransactionsService } from "../transaction/transactions.service";
import { CustomError } from "../errors/custom-error";

export const INVOICES_STORAGE_TOKEN = Symbol.for("INVOICES_STORAGE_TOKEN");

@Injectable()
export class InvoicesService {
	constructor(
		@Inject(INVOICES_STORAGE_TOKEN) private readonly invoicesStorage: InvoicesStoragePort,
		private readonly invoicesDomainService: InvoicesDomainService,
		private readonly transactionsService: TransactionsService
	) {}

	async create(invoiceDto: CreateInvoiceDto): Promise<Invoice> {
		const method = "InvoicesService/create";
		Logger.log(`${method} - start`);

		try {
			const invoice = this.invoicesDomainService.fromCreateInvoiceDto(invoiceDto);

			const createdInvoice = await this.invoicesStorage.create(invoice);

			Logger.verbose(`${method} - invoice created`, invoice.publicId);
			Logger.log(`${method} - end`);
			return createdInvoice;
		} catch (err) {
			Logger.error(`${method} - failed to create invoice`, err instanceof Error ? err.message : err);
			throw err instanceof CustomError ? err : new CustomError("Failed to create invoice");
		}
	}

	async getByPublicId(invoicePublicId: string): Promise<Invoice> {
		const method = "InvoicesService/getByPublicId";
		Logger.log(`${method} - start`);
		Logger.verbose(`${method} - invoice public id`, invoicePublicId);

		try {
			const invoiceWithCustomer = await this.invoicesStorage.getByPublicId(invoicePublicId);
			if (!invoiceWithCustomer) {
				throw new CustomError("Invoice not found by id");
			}

			Logger.log(`${method} - end`);
			return invoiceWithCustomer;
		} catch (err) {
			Logger.error(`${method} - failed to get invoice`, err instanceof Error ? err.message : err);
			throw err instanceof CustomError ? err : new CustomError("Failed to get invoice");
		}
	}

	async getByReferenceId(referenceId: string): Promise<Invoice> {
		const method = "InvoicesService/getByReferenceId";
		Logger.log(`${method} - start`);
		Logger.verbose(`${method} - invoice reference id`, referenceId);

		try {
			const invoiceWithCustomer = await this.invoicesStorage.getByReferenceId(referenceId);
			if (!invoiceWithCustomer) {
				throw new CustomError("Invoice not found by reference id");
			}

			Logger.log(`${method} - end`);
			return invoiceWithCustomer;
		} catch (err) {
			Logger.error(`${method} - failed to get invoice`, err instanceof Error ? err.message : err);
			throw err instanceof CustomError ? err : new CustomError("Failed to get invoice");
		}
	}

	async getByCustomerName(
		customerName: string,
		filters?: {
			dueDate?: string;
			invoiceDate?: string;
			dueDateFrom?: string;
			dueDateTo?: string;
			invoiceDateFrom?: string;
			invoiceDateTo?: string;
		}
	): Promise<Invoice[]> {
		const method = "InvoicesService/getByCustomerName";
		Logger.log(`${method} - start`);

		try {
			const invoices = await this.invoicesStorage.getByCustomerName(customerName, filters);

			Logger.log(`${method} - end`);
			return invoices;
		} catch (err) {
			Logger.error(`${method} - failed to get invoice`, err instanceof Error ? err.message : err);
			throw err instanceof CustomError ? err : new CustomError("Failed to get invoice");
		}
	}

	// async getWithFilters(parameters: {
	// 	dueDate?: string;
	// 	invoiceDate?: string;
	// 	dueDateFrom?: string;
	// 	dueDateTo?: string;
	// 	invoiceDateFrom?: string;
	// 	invoiceDateTo?: string;
	// }): Promise<Invoice[]> {
	// 	const method = "InvoicesService/getWithFilters";
	// 	Logger.log(`${method} - start`);

	// 	const invoices = await this.invoicesStorage.getWithFilters(parameters);

	// 	Logger.log(`${method} - end`);
	// }
}
