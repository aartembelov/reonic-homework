import { Injectable } from "@nestjs/common";
import { CreateInvoiceDto } from "./interfaces/dtos/create-invoice-dto.interface";
import { Invoice, InvoiceItem, InvoiceStatus } from "./interfaces/invoice.interface";
import { Customer } from "../customers/interfaces/customer.interface";

type InvoiceWithoutCustomer = Omit<Invoice, "customer"> & { customer?: Customer };

@Injectable()
export class InvoicesDomainService {
	private DEFAULT_CURRENCY = "EUR";

	fromCreateInvoiceDto(invoiceDto: CreateInvoiceDto): InvoiceWithoutCustomer {
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

		return {
			publicId: this.generateInvoicePublicId(),
			referenceId: invoiceDto.invoiceId,
			number: invoiceDto.invoiceNumber,
			issueDate: invoiceDto.invoiceDate,
			dueDate: invoiceDto.dueDate,
			items: invoiceItems,
			subtotal: invoiceDto.subtotal,
			tax: invoiceDto.tax,
			total: invoiceDto.total,
			currency: invoiceDto.currency ?? this.DEFAULT_CURRENCY,
			status: invoiceStatus,
		};
	}

	setCustomer(invoice: InvoiceWithoutCustomer, customer: Customer): Invoice {
		invoice.customer = customer;
		return invoice as Invoice;
	}

	private generateInvoicePublicId(): string {
		return `inv_${crypto.randomUUID()}`;
	}

	private generateInvoiceItemPublicId(): string {
		return `invi_${crypto.randomUUID()}`;
	}

	private generateCustomerPublicId(): string {
		return `cus_${crypto.randomUUID()}`;
	}

	private generateCustomerAddressPublicId(): string {
		return `addr_${crypto.randomUUID()}`;
	}
}
