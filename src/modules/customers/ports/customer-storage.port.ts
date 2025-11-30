import { Customer } from "../interfaces/customer.interface";

export interface CustomersStoragePort {
	create(customer: Customer, transaction?: unknown): Promise<Customer>;
	getByPublicId(publicId: string, transaction?: unknown): Promise<Customer>;
}
