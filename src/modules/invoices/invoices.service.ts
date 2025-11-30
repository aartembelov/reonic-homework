import { Inject, Injectable, Logger } from "@nestjs/common";
import { InvoicesStoragePort } from "./ports/invoices-storage.port";
import { Invoice } from "./interfaces/invoice.interface";
import { CreateInvoiceDto } from "./interfaces/dtos/create-invoice-dto.interface";
import { InvoicesDomainService } from "./invoices.domain.service";
import { CustomersService } from "../customers/customers.service";
import { CreateCustomerDto } from "../customers/interfaces/create-customer-dto.interface";
import { TransactionsService } from "../transaction/transactions.service";

export const INVOICES_STORAGE_TOKEN = Symbol.for("INVOICES_STORAGE_TOKEN");

@Injectable()
export class InvoicesService {
	constructor(
		@Inject(INVOICES_STORAGE_TOKEN) private readonly invoicesStorage: InvoicesStoragePort,
		private readonly invoicesDomainService: InvoicesDomainService,
		private readonly customersService: CustomersService,
		private readonly transactionsService: TransactionsService
	) {}

	async create(invoiceDto: CreateInvoiceDto): Promise<Invoice> {
		const method = "InvoicesService/create";
		Logger.log(`${method} - start`);

		try {
			const invoiceWithoutCustomer = this.invoicesDomainService.fromCreateInvoiceDto(invoiceDto);

			const createCustomerDto: CreateCustomerDto = {
				name: invoiceDto.customer.name,
				email: invoiceDto.customer.email,
				address: invoiceDto.customer.address,
			};

			const createdInvoice = await this.transactionsService.executeTransaction(async (transaction) => {
				const createdCustomer = await this.customersService.create(createCustomerDto, transaction);

				const invoice = this.invoicesDomainService.setCustomer(invoiceWithoutCustomer, createdCustomer);

				const createdInvoice = await this.invoicesStorage.create(invoice, transaction);

				return createdInvoice;
			});

			Logger.verbose(`${method} - invoice created`, createdInvoice.publicId);
			Logger.log(`${method} - end`);
			return createdInvoice;
		} catch (err) {
			Logger.error(`${method} - failed to create invoice`, err instanceof Error ? err.message : err);
			throw new Error("Failed to create invoice");
		}
	}
}
