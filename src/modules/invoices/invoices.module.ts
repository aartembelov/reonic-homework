import { Module } from "@nestjs/common";
import { InvoicesController } from "./invoices.controller";
import { INVOICES_STORAGE_TOKEN, InvoicesService } from "./invoices.service";
import { PostgresInvoicesStorageAdapter } from "./adapters/postgres-invoices-storage.adapter";

@Module({
	controllers: [InvoicesController],
	providers: [InvoicesService, { provide: INVOICES_STORAGE_TOKEN, useClass: PostgresInvoicesStorageAdapter }],
})
export class InvoicesModule {}
