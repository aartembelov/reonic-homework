import { Module } from "@nestjs/common";
import { TRANSACTION_PORT, TransactionsService } from "./transactions.service";
import { PostgresTransactionsAdapter } from "./adapters/postgres-transactions.adapter";

@Module({
	providers: [TransactionsService, { provide: TRANSACTION_PORT, useClass: PostgresTransactionsAdapter }],
	exports: [TransactionsService],
})
export class TransactionsModule {}
