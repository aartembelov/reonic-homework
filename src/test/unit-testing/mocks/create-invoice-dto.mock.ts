import { CreateInvoiceDto } from "../../../modules/invoices/interfaces/dtos/create-invoice-dto.interface";
import { generateMock } from "./object.utils";

const baseDto: CreateInvoiceDto = {
	referenceId: "ref-001",
	number: "2024-0001",
	customer: {
		name: "John",
		email: "Doe",
	},
	items: [
		{ description: "Item 1", quantity: 2, unitPrice: 100, total: 200 },
		{ description: "Item 2", quantity: 1, unitPrice: 50, total: 50 },
	],
	subtotal: 250,
	tax: 50,
	total: 300,
	currency: "EUR",
	status: "draft",
	issueDate: new Date("2024-01-01"),
	dueDate: new Date("2024-01-15"),
};

export const generateCreateInvoiceDto = generateMock(baseDto);
