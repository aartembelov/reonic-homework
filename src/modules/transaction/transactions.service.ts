import { Inject, Injectable } from "@nestjs/common";
import { TransactionsPort } from "./ports/transactions.port";

export const TRANSACTION_PORT = Symbol.for("TRANSACTION_PORT");

@Injectable()
export class TransactionsService {
	constructor(@Inject(TRANSACTION_PORT) private readonly transactionAdapter: TransactionsPort) {}

	async executeTransaction<T = unknown>(callback: (transaction: unknown) => Promise<T>): Promise<T> {
		return await this.transactionAdapter.executeTransaction(callback);
	}
}
