import { Injectable } from "@nestjs/common";
import { CreateInvoiceDto, CreateInvoiceItemDto } from "./interfaces/dtos/create-invoice-dto.interface";
import { Invoice, InvoiceItem, InvoiceStatus } from "./interfaces/invoice.interface";
import { CustomersDomainService } from "./customers.domain.service";
import { CustomError } from "../errors/custom-error";

@Injectable()
export class InvoicesDomainService {
	private DEFAULT_CURRENCY = "EUR";

	constructor(private readonly customersDomainService: CustomersDomainService) {}

	fromCreateInvoiceDto(invoiceDto: CreateInvoiceDto): Invoice {
		const error = this.validate(invoiceDto);
		if (error) {
			throw error;
		}

		const statusMapping: Record<CreateInvoiceDto["status"], InvoiceStatus> = {
			draft: InvoiceStatus.Draft,
			sent: InvoiceStatus.Sent,
			paid: InvoiceStatus.Paid,
			overdue: InvoiceStatus.Overdue,
			cancelled: InvoiceStatus.Cancelled,
		};

		const invoiceStatus: InvoiceStatus = statusMapping[invoiceDto.status];

		const invoiceItems: InvoiceItem[] = invoiceDto.items.map((item) => ({
			publicId: this.generateInvoiceItemPublicId(),
			description: item.description,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			total: item.total,
		}));

		const customer = this.customersDomainService.fromCreateCustomerDto(invoiceDto.customer);

		return {
			publicId: this.generateInvoicePublicId(),
			referenceId: invoiceDto.referenceId,
			number: invoiceDto.number,
			customer: customer,
			issueDate: invoiceDto.issueDate,
			dueDate: invoiceDto.dueDate,
			items: invoiceItems,
			subtotal: invoiceDto.subtotal,
			tax: invoiceDto.tax,
			total: invoiceDto.total,
			currency: invoiceDto.currency ?? this.DEFAULT_CURRENCY,
			status: invoiceStatus,
		};
	}

	private validate(invoiceDto: CreateInvoiceDto): CustomError | void {
		const validations: ((dto: CreateInvoiceDto) => CustomError | void)[] = [
			this.validateSubtotalAmount,
			this.validateInvoiceItemsTotalAmount,
			this.validateTotalAmount,
			this.validateIssueAndDueDate,
		];

		for (const validation of validations) {
			const error = validation.call(this, invoiceDto);
			if (error) {
				return error;
			}
		}
	}

	private validateInvoiceItemsTotalAmount(invoice: Invoice | CreateInvoiceDto) {
		for (const invoiceItem of invoice.items) {
			const totalAmountToValidate = invoiceItem.unitPrice * invoiceItem.quantity;
			if (totalAmountToValidate !== invoiceItem.total) {
				return new CustomError("Invoice item total is invalid: it does not equal unit price multiplied by quantity");
			}
		}
	}

	private validateSubtotalAmount(invoice: Invoice | CreateInvoiceDto): CustomError | void {
		const totalToValidate = invoice.items.reduce((acc, item) => acc + item.total, 0);

		if (totalToValidate !== invoice.subtotal) {
			return new CustomError("Invoice subtotal does not match the sum of item totals");
		}
	}

	private validateTotalAmount(invoice: Invoice | CreateInvoiceDto): CustomError | void {
		if (invoice.total !== invoice.subtotal + invoice.tax) {
			return new CustomError("Invoice total does not match the sum of tax and subtotal");
		}
	}

	private validateIssueAndDueDate(invoice: Invoice | CreateInvoiceDto): CustomError | void {
		if (invoice.issueDate.getTime() >= invoice.dueDate.getTime()) {
			return new CustomError("Invoice issue date is greater than invoice due date");
		}
	}

	private generateInvoicePublicId(): string {
		return `inv_${crypto.randomUUID()}`;
	}

	private generateInvoiceItemPublicId(): string {
		return `invi_${crypto.randomUUID()}`;
	}
}
