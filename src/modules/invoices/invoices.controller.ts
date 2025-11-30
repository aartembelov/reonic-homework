import { Body, Controller, Get, Logger, Param, Post, Query, UsePipes } from "@nestjs/common";
import { JsonSchemaValidationPipe } from "../../shared/pipes/json-schema-validation.pipe";
import invoiceSchema from "../../../schema/invoice.schema.json";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceRequest } from "./interfaces/requests/create-invoice-request.interface";
import { CreateInvoiceDto } from "./interfaces/dtos/create-invoice-dto.interface";
import { InvoiceResponse } from "./interfaces/responses/invoice-response.interface";
import { Invoice } from "./interfaces/invoice.interface";
import { CustomError } from "../errors/custom-error";

@Controller({ path: ["invoices"] })
export class InvoicesController {
	constructor(private readonly invoicesService: InvoicesService) {}

	@Post()
	@UsePipes(new JsonSchemaValidationPipe(invoiceSchema))
	async create(@Body() createInvoiceRequest: CreateInvoiceRequest): Promise<InvoiceResponse> {
		const method = "InvoicesController/create";
		Logger.log(`${method} - start`);

		const invoiceDto: CreateInvoiceDto = {
			referenceId: createInvoiceRequest.invoiceId,
			number: createInvoiceRequest.invoiceNumber,
			customer: {
				name: createInvoiceRequest.customerName,
				email: createInvoiceRequest.customerEmail,
				address: createInvoiceRequest.customerAddress,
			},
			issueDate: new Date(createInvoiceRequest.invoiceDate),
			dueDate: new Date(createInvoiceRequest.dueDate),
			items: createInvoiceRequest.items,
			subtotal: createInvoiceRequest.subtotal,
			tax: createInvoiceRequest.tax,
			total: createInvoiceRequest.total,
			status: createInvoiceRequest.status,
		};

		const invoice = await this.invoicesService.create(invoiceDto);

		const invoiceResponse = this.fromDomain(invoice);

		Logger.log(`${method} - end`);
		return invoiceResponse;
	}

	@Get(":public_id")
	async getByPublicId(@Param("public_id") publicId: string): Promise<InvoiceResponse> {
		const method = "InvoicesController/getByPublicId";
		Logger.log(`${method} - start`);

		if (!publicId) {
			throw new CustomError("Invoice ID is not defined");
		}

		const invoice = await this.invoicesService.getByPublicId(publicId);

		const invoiceResponse = this.fromDomain(invoice);

		Logger.log(`${method} - end`);
		return invoiceResponse;
	}

	@Get()
	async getByQuery(
		@Query("invoiceId") invoiceId?: string,
		@Query("customerName") customerName?: string,
		@Query("invoiceDate") invoiceDate?: string,
		@Query("dueDate") dueDate?: string,
		@Query("invoiceDateFrom") invoiceDateFrom?: string,
		@Query("invoiceDateTo") invoiceDateTo?: string,
		@Query("dueDateFrom") dueDateFrom?: string,
		@Query("dueDateTo") dueDateTo?: string
	): Promise<InvoiceResponse | InvoiceResponse[]> {
		const method = "InvoicesController/getByQuery";
		Logger.log(`${method} - start`);
		const filters = { dueDate, invoiceDate, dueDateFrom, dueDateTo, invoiceDateFrom, invoiceDateTo };

		const error = this.validateQueryParameters(filters);
		if (error) {
			throw error;
		}

		let invoiceResponse: InvoiceResponse | InvoiceResponse[];
		if (invoiceId) {
			const invoice = await this.invoicesService.getByReferenceId(invoiceId);
			invoiceResponse = this.fromDomain(invoice);
		} else if (customerName) {
			const results = await this.invoicesService.getByCustomerName(customerName, filters);
			invoiceResponse = results.map((invoice) => this.fromDomain(invoice));
		} else {
			throw new CustomError("Either invoiceId or customerName is required");
		}

		Logger.log(`${method} - end`);
		return invoiceResponse;
	}

	private validateQueryParameters(parameters: {
		invoiceDate?: string;
		invoiceDateFrom?: string;
		invoiceDateTo?: string;
		dueDate?: string;
		dueDateFrom?: string;
		dueDateTo?: string;
	}): CustomError | void {
		const { invoiceDate, invoiceDateFrom, invoiceDateTo, dueDate, dueDateFrom, dueDateTo } = parameters;

		if (invoiceDate && (invoiceDateFrom || invoiceDateTo)) {
			return new CustomError("Cannot use 'invoiceDate' along with invoice date range parameters");
		}

		if ((invoiceDateFrom && !invoiceDateTo) || (!invoiceDateFrom && invoiceDateTo)) {
			return new CustomError("Both range parameters must be present for 'invoiceDate'");
		}

		if (dueDate && (dueDateFrom || dueDateTo)) {
			return new CustomError("Cannot use 'dueDate' along with due date range parameters");
		}

		if ((dueDateFrom && !dueDateTo) || (!dueDateFrom && dueDateTo)) {
			return new CustomError("Both range parameters must be present for 'dueDate'");
		}
	}

	private fromDomain(invoice: Invoice): InvoiceResponse {
		const invoiceItems: InvoiceResponse["items"] = invoice.items.map((item) => ({
			id: item.publicId,
			description: item.description,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			total: item.total,
		}));

		const customerAddress: InvoiceResponse["customer"]["address"] = invoice.customer.address
			? {
					id: invoice.customer.address.publicId,
					street: invoice.customer.address.street,
					city: invoice.customer.address.city,
					postal_code: invoice.customer.address.postalCode,
					country: invoice.customer.address.country,
			  }
			: undefined;

		return {
			id: invoice.publicId,
			invoiceId: invoice.referenceId,
			invoiceNumber: invoice.number,
			customer: {
				id: invoice.customer.publicId,
				name: invoice.customer.name,
				email: invoice.customer.email,
				address: customerAddress,
			},
			invoiceDate: invoice.issueDate.toDateString(),
			dueDate: invoice.dueDate.toDateString(),
			items: invoiceItems,
			subtotal: invoice.subtotal,
			tax: invoice.tax,
			total: invoice.total,
			currency: invoice.currency,
			status: invoice.status,
		};
	}
}
