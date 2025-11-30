import { Injectable } from "@nestjs/common";
import { TransactionsPort } from "../ports/transactions.port";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PostgresTransactionsAdapter implements TransactionsPort {
	constructor(private readonly prisma: PrismaService) {}

	async executeTransaction<T = unknown>(callback: (transaction: unknown) => Promise<T>): Promise<T> {
		return await this.prisma.$transaction(callback);
	}
}
