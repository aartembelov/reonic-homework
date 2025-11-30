import { Module } from "@nestjs/common";
import { InvoicesController } from "./invoices.controller";
import { INVOICES_STORAGE_TOKEN, InvoicesService } from "./invoices.service";
import { PostgresInvoicesStorageAdapter } from "./adapters/postgres-invoices-storage.adapter";
import { InvoicesDomainService } from "./invoices.domain.service";
import { CustomersDomainService } from "./customers.domain.service";

@Module({
	controllers: [InvoicesController],
	providers: [
		InvoicesService,
		InvoicesDomainService,
		CustomersDomainService,
		{ provide: INVOICES_STORAGE_TOKEN, useClass: PostgresInvoicesStorageAdapter },
	],
})
export class InvoicesModule {}
