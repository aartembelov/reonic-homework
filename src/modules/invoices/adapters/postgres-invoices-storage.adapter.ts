import { Injectable } from "@nestjs/common";
import { InvoicesStoragePort } from "../ports/invoices-storage.port";
import { Invoice } from "../interfaces/invoice.interface";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PostgresInvoicesStorageAdapter implements InvoicesStoragePort {
	constructor(private readonly prismaService: PrismaService) {}

	create(invoice: Invoice): Promise<Invoice> {
		throw new Error("Method not implemented.");
	}
}
