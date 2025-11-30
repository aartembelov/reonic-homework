import { Inject, Injectable } from "@nestjs/common";
import { CustomersStoragePort } from "./ports/customer-storage.port";
import { Customer } from "./interfaces/customer.interface";
import { CreateCustomerDto } from "./interfaces/create-customer-dto.interface";
import { CustomersDomainService } from "./customers.domain.service";

export const CUSTOMERS_STORAGE_TOKEN = Symbol.for("CUSTOMERS_STORAGE_TOKEN");

@Injectable()
export class CustomersService {
	constructor(
		private readonly customersDomainService: CustomersDomainService,
		@Inject(CUSTOMERS_STORAGE_TOKEN) private readonly customersStorage: CustomersStoragePort
	) {}

	async create(customerDto: CreateCustomerDto, transaction?: unknown): Promise<Customer> {
		const customer = this.customersDomainService.fromCreateCustomerDto(customerDto);

		const createdCustomer = await this.customersStorage.create(customer, transaction);

		return createdCustomer;
	}
}
