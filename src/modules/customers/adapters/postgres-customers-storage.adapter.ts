import { Injectable, Logger } from "@nestjs/common";
import { CustomersStoragePort } from "../ports/customer-storage.port";
import { Customer, CustomerAddress, CustomerWithoutId } from "../interfaces/customer.interface";
import { PrismaService } from "../../prisma/prisma.service";
import { Customer as DbCustomer, Address as DbAddress } from "@prisma/client";

@Injectable()
export class PostgresCustomersStorageAdapter implements CustomersStoragePort {
	constructor(private readonly prismaService: PrismaService) {}

	async create(customer: CustomerWithoutId): Promise<Customer> {
		const method = "PostgresCustomersStorageAdapter/create";
		Logger.log(`${method} - start`);

		try {
			const dbAddress = customer.address
				? {
						public_id: customer.address.publicId,
						street: customer.address.street,
						city: customer.address.city,
						postal_code: customer.address.postal_code,
						country: customer.address.country,
				  }
				: undefined;

			const response = await this.prismaService.customer.create({
				data: {
					public_id: customer.publicId,
					name: customer.name,
					email: customer.email,
					address: {
						create: dbAddress,
					},
				},
				include: {
					address: true,
				},
			});

			const createdCustomer = this.toDomain(response);

			Logger.verbose(`${method} - created customer`, createdCustomer.publicId);
			Logger.log(`${method} - end`);
			return createdCustomer;
		} catch (err) {
			Logger.error(`${method} - failed to create a customer`, err instanceof Error ? err.message : err);
			throw new Error("Failed to create a customer");
		}
	}

	getByPublicId(publicId: string): Promise<Customer> {
		throw new Error("Method not implemented.");
	}

	private toDomain(dbCustomer: DbCustomer & { address: DbAddress }): Customer {
		const address: CustomerAddress | undefined = dbCustomer.address
			? {
					publicId: dbCustomer.address.public_id,
					street: dbCustomer.address.street ?? undefined,
					city: dbCustomer.address.city ?? undefined,
					postal_code: dbCustomer.address.postal_code ?? undefined,
					country: dbCustomer.address.country ?? undefined,
			  }
			: undefined;

		return {
			id: dbCustomer.id,
			publicId: dbCustomer.public_id,
			name: dbCustomer.name,
			email: dbCustomer.email,
			address: address,
		};
	}
}
