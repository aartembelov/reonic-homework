import { Inject, Injectable, Logger } from "@nestjs/common";
import { InvoicesStoragePort } from "./ports/invoices-storage.port";
import { Invoice } from "./interfaces/invoice.interface";
import { CreateInvoiceDto } from "./interfaces/dtos/create-invoice-dto.interface";
import { InvoicesDomainService } from "./invoices.domain.service";
import { CustomersService } from "../customers/customers.service";
import { CreateCustomerDto } from "../customers/interfaces/create-customer-dto.interface";
import { TransactionsService } from "../transaction/transactions.service";
import { Customer } from "../customers/interfaces/customer.interface";
import { CustomError } from "../errors/custom-error";

export const INVOICES_STORAGE_TOKEN = Symbol.for("INVOICES_STORAGE_TOKEN");

@Injectable()
export class InvoicesService {
	constructor(
		@Inject(INVOICES_STORAGE_TOKEN) private readonly invoicesStorage: InvoicesStoragePort,
		private readonly invoicesDomainService: InvoicesDomainService,
		private readonly customersService: CustomersService,
		private readonly transactionsService: TransactionsService
	) {}

	async create(invoiceDto: CreateInvoiceDto): Promise<{ invoice: Invoice; customer: Customer }> {
		const method = "InvoicesService/create";
		Logger.log(`${method} - start`);

		try {
			const invoiceWithoutCustomer = this.invoicesDomainService.fromCreateInvoiceDto(invoiceDto);

			const createCustomerDto: CreateCustomerDto = {
				name: invoiceDto.customer.name,
				email: invoiceDto.customer.email,
				address: invoiceDto.customer.address,
			};

			const { invoice, customer } = await this.transactionsService.executeTransaction(async (transaction) => {
				const createdCustomer = await this.customersService.create(createCustomerDto, transaction);

				const invoice = this.invoicesDomainService.setCustomerId(invoiceWithoutCustomer, createdCustomer.id);

				const createdInvoice = await this.invoicesStorage.create(invoice, transaction);

				return { invoice: createdInvoice, customer: createdCustomer };
			});

			Logger.verbose(`${method} - invoice created`, invoice.publicId);
			Logger.verbose(`${method} - customer created`, customer.publicId);
			Logger.log(`${method} - end`);
			return { invoice, customer };
		} catch (err) {
			Logger.error(`${method} - failed to create invoice`, err instanceof Error ? err.message : err);
			throw err instanceof CustomError ? err : new CustomError("Failed to create invoice");
		}
	}

	async getByPublicId(invoicePublicId: string): Promise<{ invoice: Invoice; customer: Customer }> {
		const method = "InvoicesService/getByPublicId";
		Logger.log(`${method} - start`);
		Logger.verbose(`${method} - invoice public id`, invoicePublicId);

		try {
			const invoice = await this.invoicesStorage.getByPublicId(invoicePublicId);
			if (!invoice) {
				throw new CustomError("Invoice not found by id");
			}

			const customer = await this.customersService.getById(invoice.customerId);

			Logger.log(`${method} - end`);
			return { invoice, customer };
		} catch (err) {
			Logger.error(`${method} - failed to get invoice`, err instanceof Error ? err.message : err);
			throw err instanceof CustomError ? err : new CustomError("Failed to get invoice");
		}
	}
}
