import { Body, Controller, Get, Logger, Param, Post, Query, UsePipes } from "@nestjs/common";
import { JsonSchemaValidationPipe } from "../../shared/pipes/json-schema-validation.pipe";
import invoiceSchema from "../../../schema/invoice.schema.json";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceRequest } from "./interfaces/requests/create-invoice-request.interface";
import { CreateInvoiceDto } from "./interfaces/dtos/create-invoice-dto.interface";
import { InvoiceResponse } from "./interfaces/responses/invoice-response.interface";
import { Invoice } from "./interfaces/invoice.interface";
import { CustomError } from "../errors/custom-error";
import { InvoiceFilters } from "./ports/invoices-storage.port";
import { Page } from "../../shared/pagination/interfaces/page.interface";
import { PaginationParameters } from "../../shared/pagination/domain/pagination-parameters";

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
		@Query("dueDateTo") dueDateTo?: string,
		@Query("page") page?: string,
		@Query("limit") limit?: string
	): Promise<InvoiceResponse | Page<InvoiceResponse>> {
		const method = "InvoicesController/getByQuery";
		Logger.log(`${method} - start`);
		const filters = this.toInvoiceFilters({
			dueDate,
			invoiceDate,
			dueDateFrom,
			dueDateTo,
			invoiceDateFrom,
			invoiceDateTo,
		});

		const pagination = new PaginationParameters({
			page: page ? parseInt(page) : undefined,
			limit: limit ? parseInt(limit) : undefined,
		});

		let invoiceResponse: InvoiceResponse | Page<InvoiceResponse>;
		if (invoiceId) {
			const invoice = await this.invoicesService.getByReferenceId(invoiceId);
			invoiceResponse = this.fromDomain(invoice);
		} else if (customerName) {
			const results = await this.invoicesService.getByCustomerName(customerName, { filters, pagination });
			invoiceResponse = {
				page: results.page,
				limit: results.limit,
				data: results.data.map((invoice) => this.fromDomain(invoice)),
			};
		} else {
			const results = await this.invoicesService.getWithFilters(filters, { pagination });
			invoiceResponse = {
				page: results.page,
				limit: results.limit,
				data: results.data.map((invoice) => this.fromDomain(invoice)),
			};
		}

		Logger.log(`${method} - end`);
		return invoiceResponse;
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

	private toInvoiceFilters(queryFilters: {
		dueDate?: string;
		invoiceDate?: string;
		dueDateFrom?: string;
		dueDateTo?: string;
		invoiceDateFrom?: string;
		invoiceDateTo?: string;
	}): InvoiceFilters {
		const { dueDate, invoiceDate, dueDateFrom, dueDateTo, invoiceDateFrom, invoiceDateTo } = queryFilters;

		return {
			dueDate: dueDate ? new Date(dueDate) : undefined,
			issueDate: invoiceDate ? new Date(invoiceDate) : undefined,
			dueDateFrom: dueDateFrom ? new Date(dueDateFrom) : undefined,
			dueDateTo: dueDateTo ? new Date(dueDateTo) : undefined,
			issueDateFrom: invoiceDateFrom ? new Date(invoiceDateFrom) : undefined,
			issueDateTo: invoiceDateTo ? new Date(invoiceDateTo) : undefined,
		};
	}
}
