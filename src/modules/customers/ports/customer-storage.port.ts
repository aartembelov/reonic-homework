import { Customer, CustomerWithoutId } from "../interfaces/customer.interface";

export interface CustomersStoragePort {
	create(customer: CustomerWithoutId, transaction?: unknown): Promise<Customer>;
	getByPublicId(publicId: string, transaction?: unknown): Promise<Customer>;
}
