import { Customer, CustomerWithoutId } from "../interfaces/customer.interface";

export interface CustomersStoragePort {
	create(customer: CustomerWithoutId, transaction?: unknown): Promise<Customer>;
	getById(customerId: number, transaction?: unknown): Promise<Customer | null>;
}
