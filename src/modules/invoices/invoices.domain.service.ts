import { Injectable } from "@nestjs/common";
import { CreateInvoiceDto } from "./interfaces/dtos/create-invoice-dto.interface";
import { Invoice, InvoiceItem, InvoiceStatus, InvoiceWithoutId } from "./interfaces/invoice.interface";

type InvoiceWithoutCustomerId = Omit<InvoiceWithoutId, "customerId">;

@Injectable()
export class InvoicesDomainService {
	private DEFAULT_CURRENCY = "EUR";

	fromCreateInvoiceDto(invoiceDto: CreateInvoiceDto): InvoiceWithoutCustomerId {
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
			referenceId: invoiceDto.referenceId,
			number: invoiceDto.number,
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

	setCustomerId(invoice: InvoiceWithoutCustomerId, customerId: number): InvoiceWithoutId | Invoice {
		return { ...invoice, customerId };
	}

	private generateInvoicePublicId(): string {
		return `inv_${crypto.randomUUID()}`;
	}

	private generateInvoiceItemPublicId(): string {
		return `invi_${crypto.randomUUID()}`;
	}
}
