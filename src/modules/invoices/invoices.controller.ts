import { Body, Controller, Get, Logger, Param, Post, UsePipes } from "@nestjs/common";
import { JsonSchemaValidationPipe } from "../../shared/pipes/json-schema-validation.pipe";
import invoiceSchema from "../../../schema/invoice.schema.json";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceRequest } from "./interfaces/requests/create-invoice-request.interface";
import { CreateInvoiceDto } from "./interfaces/dtos/create-invoice-dto.interface";
import { InvoiceResponse } from "./interfaces/responses/invoice-response.interface";
import { Invoice } from "./interfaces/invoice.interface";
import { Customer } from "../customers/interfaces/customer.interface";
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

		const { invoice, customer } = await this.invoicesService.create(invoiceDto);

		const invoiceResponse = this.fromDomain(invoice, customer);

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

		const { invoice, customer } = await this.invoicesService.getByPublicId(publicId);

		const invoiceResponse = this.fromDomain(invoice, customer);

		Logger.log(`${method} - end`);
		return invoiceResponse;
	}

	private fromDomain(invoice: Invoice, customer: Customer): InvoiceResponse {
		const invoiceItems: InvoiceResponse["items"] = invoice.items.map((item) => ({
			id: item.publicId,
			description: item.description,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			total: item.total,
		}));

		const customerAddress: InvoiceResponse["customer"]["address"] = customer.address
			? {
					publicId: customer.address.publicId,
					street: customer.address.street,
					city: customer.address.city,
					postal_code: customer.address.postal_code,
					country: customer.address.country,
			  }
			: undefined;

		return {
			id: invoice.publicId,
			invoiceId: invoice.referenceId,
			invoiceNumber: invoice.number,
			customer: {
				id: customer.publicId,
				name: customer.name,
				email: customer.email,
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
