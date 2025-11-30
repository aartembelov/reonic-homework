import { Body, Controller, Get, Logger, Post, UsePipes } from "@nestjs/common";
import { JsonSchemaValidationPipe } from "../../shared/pipes/json-schema-validation.pipe";
import invoiceSchema from "../../../schema/invoice.schema.json";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceRequest } from "./interfaces/requests/create-invoice-request.interface";

@Controller({ path: ["invoices"] })
export class InvoicesController {
	constructor(private readonly invoicesService: InvoicesService) {}

	@Post()
	@UsePipes(new JsonSchemaValidationPipe(invoiceSchema))
	create(@Body() invoice: CreateInvoiceRequest) {}

	@Get()
	get() {}
}
