import { Module } from "@nestjs/common";
import { CUSTOMERS_STORAGE_TOKEN, CustomersService } from "./customers.service";
import { CustomersDomainService } from "./customers.domain.service";
import { PostgresCustomersStorageAdapter } from "./adapters/postgres-customers-storage.adapter";

@Module({
	providers: [
		CustomersService,
		CustomersDomainService,
		{ provide: CUSTOMERS_STORAGE_TOKEN, useClass: PostgresCustomersStorageAdapter },
	],
	exports: [CustomersService],
})
export class CustomersModule {}
