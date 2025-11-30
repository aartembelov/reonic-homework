import { Injectable, Logger } from "@nestjs/common";
import { InvoiceFilters, InvoicesStoragePort } from "../ports/invoices-storage.port";
import { Invoice, InvoiceItem, InvoiceStatus } from "../interfaces/invoice.interface";
import { PrismaService } from "../../prisma/prisma.service";
import {
	Invoice as DbInvoice,
	InvoiceItem as DbInvoiceItem,
	InvoiceStatus as DbInvoiceStatus,
	Customer as DbCustomer,
	Prisma,
	CustomerAddress as DbCustomerAddress,
} from "@prisma/client";
import { CustomError } from "../../errors/custom-error";

@Injectable()
export class PostgresInvoicesStorageAdapter implements InvoicesStoragePort {
	constructor(private readonly prismaService: PrismaService) {}

	async create(invoice: Invoice, transaction?: Prisma.TransactionClient): Promise<Invoice> {
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

			const response = await (transaction ?? this.prismaService).invoice.create({
				data: {
					public_id: invoice.publicId,
					reference_id: invoice.referenceId,
					customer: {
						create: {
							public_id: invoice.customer.publicId,
							name: invoice.customer.name,
							email: invoice.customer.email,
							address: invoice.customer.address
								? {
										create: {
											public_id: invoice.customer.address?.publicId,
											street: invoice.customer.address.street,
											city: invoice.customer.address.city,
											postal_code: invoice.customer.address.postalCode,
											country: invoice.customer.address.country,
										},
								  }
								: {},
						},
					},
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
					items: true,
					customer: {
						include: {
							address: true,
						},
					},
				},
			});

			const customer = response.customer;
			if (!customer) {
				throw new CustomError(`customer doesn't exist for invoice ${invoice.publicId}`);
			}

			const createdInvoice = this.toDomain({ ...response, customer });

			Logger.verbose(`${method} - created invoice`, createdInvoice.publicId);
			Logger.log(`${method} - end`);
			return createdInvoice;
		} catch (err) {
			Logger.error(`${method} - failed to create invoice`, err instanceof Error ? err.message : err);
			throw new CustomError("Failed to create invoice");
		}
	}

	async getByPublicId(publicId: string, transaction?: Prisma.TransactionClient): Promise<Invoice | null> {
		const method = "PostgresInvoicesStorageAdapter/getByPublicId";
		Logger.log(`${method} - start`);
		Logger.verbose(`${method} - get by public id`, publicId);

		try {
			const response = await (transaction ?? this.prismaService).invoice.findUnique({
				where: {
					public_id: publicId,
				},
				include: {
					items: true,
					customer: {
						include: {
							address: true,
						},
					},
				},
			});

			let invoice: Invoice | null = null;
			if (response) {
				const customer = response.customer;
				if (!customer) {
					throw new CustomError(`customer doesn't exist for invoice ${response.public_id}`);
				}
				invoice = this.toDomain({ ...response, customer });
			}

			Logger.log(`${method} - end`);
			return invoice;
		} catch (err) {
			Logger.error(`${method} - failed to get invoice by public id`, err instanceof Error ? err.message : err);
			throw new CustomError("Failed to get invoice by ID");
		}
	}

	async getByReferenceId(referenceId: string, transaction?: Prisma.TransactionClient): Promise<Invoice | null> {
		const method = "PostgresInvoicesStorageAdapter/getByReferenceId";
		Logger.log(`${method} - start`);
		Logger.verbose(`${method} - get by reference id`, referenceId);

		try {
			const response = await (transaction ?? this.prismaService).invoice.findFirst({
				where: {
					reference_id: referenceId,
				},
				include: {
					items: true,
					customer: {
						include: {
							address: true,
						},
					},
				},
			});

			let invoice: Invoice | null = null;
			if (response) {
				const customer = response.customer;
				if (!customer) {
					throw new CustomError(`customer doesn't exist for invoice ${response.public_id}`);
				}
				invoice = this.toDomain({ ...response, customer });
			}

			Logger.log(`${method} - end`);
			return invoice;
		} catch (err) {
			Logger.error(`${method} - failed to get invoice by reference id`, err instanceof Error ? err.message : err);
			throw new CustomError("Failed to get invoice by invoice ID");
		}
	}

	async getByCustomerId(customerId: number, transaction?: Prisma.TransactionClient): Promise<Invoice[]> {
		const method = "PostgresInvoicesStorageAdapter/getByCustomerId";
		Logger.log(`${method} - start`);
		Logger.verbose(`${method} - get by customer id`, customerId);

		try {
			const response = await (transaction ?? this.prismaService).invoice.findMany({
				where: {
					customer_id: customerId,
				},
				include: {
					items: true,
					customer: {
						include: {
							address: true,
						},
					},
				},
			});

			const invoices = response.map((dbInvoice) => {
				const customer = dbInvoice.customer;
				if (!customer) {
					throw new CustomError(`customer doesn't exist for invoice ${dbInvoice.public_id}`);
				}
				return this.toDomain({ ...dbInvoice, customer });
			});

			Logger.log(`${method} - end`);
			return invoices;
		} catch (err) {
			Logger.error(`${method} - failed to get invoice attached to customer`, err instanceof Error ? err.message : err);
			throw new CustomError("Failed to get invoice attached to customer");
		}
	}

	async getByCustomerName(
		customerName: string,
		filters?: InvoiceFilters,
		transaction?: Prisma.TransactionClient
	): Promise<Invoice[]> {
		const method = "PostgresInvoicesStorageAdapter/getByCustomerId";
		Logger.log(`${method} - start`);
		Logger.verbose(`${method} - get by customer name`, customerName);

		try {
			const response = await (transaction ?? this.prismaService).invoice.findMany({
				where: {
					customer: {
						name: customerName,
					},
					due_date: filters?.dueDate,
				},
				include: {
					items: true,
					customer: {
						include: {
							address: true,
						},
					},
				},
			});

			const invoices = response.map((dbInvoice) => {
				const customer = dbInvoice.customer;
				if (!customer) {
					throw new CustomError(`customer doesn't exist for invoice ${dbInvoice.public_id}`);
				}
				return this.toDomain({ ...dbInvoice, customer });
			});

			Logger.log(`${method} - end`);
			return invoices;
		} catch (err) {
			Logger.error(`${method} - failed to get invoice attached to customer`, err instanceof Error ? err.message : err);
			throw new CustomError("Failed to get invoice attached to customer");
		}
	}

	getWithFilters(filters: InvoiceFilters, transaction?: unknown): Promise<Invoice[]> {
		throw new Error("Method not implemented.");
	}

	private toDomain(
		dbInvoice: DbInvoice & { items: DbInvoiceItem[]; customer: DbCustomer & { address?: DbCustomerAddress } }
	): Invoice {
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
			publicId: dbInvoice.public_id,
			referenceId: dbInvoice.reference_id,
			customer: {
				publicId: dbInvoice.customer.public_id,
				name: dbInvoice.customer.name,
				email: dbInvoice.customer.email,
				address: dbInvoice.customer.address
					? {
							publicId: dbInvoice.customer.address.public_id,
							street: dbInvoice.customer.address.street ?? undefined,
							city: dbInvoice.customer.address.city ?? undefined,
							postalCode: dbInvoice.customer.address.postal_code ?? undefined,
							country: dbInvoice.customer.address.country ?? undefined,
					  }
					: undefined,
			},
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
