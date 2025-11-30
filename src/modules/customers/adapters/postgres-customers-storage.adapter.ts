import { Injectable } from "@nestjs/common";
import { CustomersStoragePort } from "../ports/customer-storage.port";
import { Customer } from "../interfaces/customer.interface";

@Injectable()
export class PostgresCustomersStorageAdapter implements CustomersStoragePort {
	create(customer: Customer): Promise<Customer> {
		throw new Error("Method not implemented.");
	}
	getByPublicId(publicId: string): Promise<Customer> {
		throw new Error("Method not implemented.");
	}
}
