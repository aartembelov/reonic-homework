import { Inject, Injectable, Logger } from "@nestjs/common";
import { CustomersStoragePort } from "./ports/customer-storage.port";
import { Customer } from "./interfaces/customer.interface";
import { CreateCustomerDto } from "./interfaces/create-customer-dto.interface";
import { CustomersDomainService } from "./customers.domain.service";
import { CustomError } from "../errors/custom-error";

export const CUSTOMERS_STORAGE_TOKEN = Symbol.for("CUSTOMERS_STORAGE_TOKEN");

@Injectable()
export class CustomersService {
	constructor(
		private readonly customersDomainService: CustomersDomainService,
		@Inject(CUSTOMERS_STORAGE_TOKEN) private readonly customersStorage: CustomersStoragePort
	) {}

	async create(customerDto: CreateCustomerDto, transaction?: unknown): Promise<Customer> {
		const method = "CustomersService/create";
		Logger.log(`${method} - start`);

		const customer = this.customersDomainService.fromCreateCustomerDto(customerDto);

		const createdCustomer = await this.customersStorage.create(customer, transaction);

		Logger.verbose(`${method} - created customer`, createdCustomer.publicId);
		Logger.log(`${method} - end`);
		return createdCustomer;
	}

	async getById(customerId: number): Promise<Customer> {
		const method = "CustomersService/getById";
		Logger.log(`${method} - start`);

		const customer = await this.customersStorage.getById(customerId);
		if (!customer) {
			throw new CustomError("Customer not found");
		}

		Logger.log(`${method} - end`);
		return customer;
	}
}
