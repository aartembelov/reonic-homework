import { Body, Controller, Get, Logger, Post, UsePipes } from "@nestjs/common";
import { JsonSchemaValidationPipe } from "../../shared/pipes/json-schema-validation.pipe";
import invoiceSchema from "../../../schema/invoice.schema.json";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceRequest } from "./interfaces/requests/create-invoice-request.interface";
import { CreateInvoiceDto } from "./interfaces/dtos/create-invoice-dto.interface";
import { InvoiceResponse } from "./interfaces/responses/invoice-response.interface";
import { Invoice } from "./interfaces/invoice.interface";

@Controller({ path: ["invoices"] })
export class InvoicesController {
	constructor(private readonly invoicesService: InvoicesService) {}

	@Post()
	@UsePipes(new JsonSchemaValidationPipe(invoiceSchema))
	async create(@Body() invoice: CreateInvoiceRequest): Promise<InvoiceResponse> {
		const method = "InvoicesController/create";
		Logger.log(`${method} - start`);

		const invoiceDto: CreateInvoiceDto = {
			referenceId: invoice.invoiceId,
			number: invoice.invoiceNumber,
			customer: {
				name: invoice.customerName,
				email: invoice.customerEmail,
				address: invoice.customerAddress,
			},
			issueDate: new Date(invoice.invoiceDate),
			dueDate: new Date(invoice.dueDate),
			items: invoice.items,
			subtotal: invoice.subtotal,
			tax: invoice.tax,
			total: invoice.total,
			status: invoice.status,
		};

		const createdInvoice = await this.invoicesService.create(invoiceDto);

		const invoiceResponse = this.fromDomain(createdInvoice);

		Logger.log(`${method} - end`);
		return invoiceResponse;
	}

	@Get()
	get() {}

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
					publicId: invoice.customer.address.publicId,
					street: invoice.customer.address.street,
					city: invoice.customer.address.city,
					postal_code: invoice.customer.address.postal_code,
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
