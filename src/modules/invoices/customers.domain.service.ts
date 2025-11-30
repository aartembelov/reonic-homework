import { Injectable } from "@nestjs/common";
import { Customer, CustomerAddress } from "./interfaces/invoice.interface";
import { CreateCustomerDto } from "./interfaces/dtos/create-customer-dto.interface";

@Injectable()
export class CustomersDomainService {
	fromCreateCustomerDto(customerDto: CreateCustomerDto): Customer {
		const address: CustomerAddress | undefined = customerDto.address
			? {
					publicId: this.generateCustomerAddressPublicId(),
					street: customerDto.address.street,
					city: customerDto.address.city,
					postalCode: customerDto.address.postalCode,
					country: customerDto.address.country,
			  }
			: undefined;

		return {
			publicId: this.generateCustomerPublicId(),
			name: customerDto.name,
			email: customerDto.email,
			address: address,
		};
	}

	private generateCustomerPublicId(): string {
		return `cus_${crypto.randomUUID()}`;
	}

	private generateCustomerAddressPublicId(): string {
		return `addr_${crypto.randomUUID()}`;
	}
}
