import { Injectable, Logger } from "@nestjs/common";
import { InvoicesStoragePort } from "../ports/invoices-storage.port";
import { Invoice, InvoiceItem, InvoiceStatus } from "../interfaces/invoice.interface";
import { PrismaService } from "../../prisma/prisma.service";
import { Invoice as DbInvoice, InvoiceItem as DbInvoiceItem, InvoiceStatus as DbInvoiceStatus } from "@prisma/client";
import { Customer } from "../../customers/interfaces/customer.interface";

@Injectable()
export class PostgresInvoicesStorageAdapter implements InvoicesStoragePort {
	constructor(private readonly prismaService: PrismaService) {}

	async create(invoice: Invoice): Promise<Invoice> {
		const method = "PostgresInvoicesStorageAdapter/create";
		Logger.log(`${method} - start`);

		try {
			const dbInvoiceItems: Omit<DbInvoiceItem, "id" | "invoice_id">[] = invoice.items.map((item) => ({
				public_id: item.publicId,
				description: item.description,
				quantity: item.quantity,
				unit_price: item.unitPrice,
				total: item.total,
			}));

			const response = await this.prismaService.invoice.create({
				data: {
					public_id: invoice.publicId,
					reference_id: invoice.referenceId,
					customer_id: invoice.customer.id,
					number: invoice.number,
					issue_date: invoice.issueDate,
					due_date: invoice.dueDate,
					items: {
						create: dbInvoiceItems,
					},
					subtotal: invoice.subtotal,
					tax: invoice.tax,
					total: invoice.total,
					currency: invoice.currency,
					status: invoice.status,
					notes: invoice.notes,
				},
				include: {
					customer: true,
					items: true,
				},
			});

			const createdInvoice = this.toDomain(response, invoice.customer);

			Logger.verbose(`${method} - created invoice`, createdInvoice.publicId);
			Logger.log(`${method} - end`);
			return createdInvoice;
		} catch (err) {
			Logger.error(`${method} - failed to create invoice`, err instanceof Error ? err.message : err);
			throw new Error("Failed to create invoice");
		}
	}

	private toDomain(dbInvoice: DbInvoice & { items: DbInvoiceItem[] }, customer: Customer): Invoice {
		const dbStatusToDomainStatus: Record<DbInvoiceStatus, InvoiceStatus> = {
			draft: InvoiceStatus.Draft,
			sent: InvoiceStatus.Sent,
			paid: InvoiceStatus.Paid,
			overdue: InvoiceStatus.Overdue,
			cancelled: InvoiceStatus.Cancelled,
		};

		const invoiceItems: InvoiceItem[] = dbInvoice.items.map((item) => ({
			publicId: item.public_id,
			description: item.description,
			quantity: item.quantity,
			unitPrice: item.unit_price,
			total: item.total,
		}));

		return {
			id: dbInvoice.id,
			publicId: dbInvoice.public_id,
			referenceId: dbInvoice.reference_id,
			customer: customer,
			number: dbInvoice.number,
			issueDate: dbInvoice.issue_date,
			dueDate: dbInvoice.due_date,
			items: invoiceItems,
			subtotal: dbInvoice.subtotal,
			tax: dbInvoice.tax,
			total: dbInvoice.total,
			currency: dbInvoice.currency,
			status: dbStatusToDomainStatus[dbInvoice.status],
		};
	}
}
