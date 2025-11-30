import { Injectable } from "@nestjs/common";
import { CreateCustomerDto } from "./interfaces/create-customer-dto.interface";
import { Customer } from "./interfaces/customer.interface";

@Injectable()
export class CustomersDomainService {
	fromCreateCustomerDto(customerDto: CreateCustomerDto): Omit<Customer, "id"> {
		const address = customerDto.address
			? {
					publicId: this.generateCustomerAddressPublicId(),
					street: customerDto.address.street,
					city: customerDto.address.city,
					postal_code: customerDto.address.postal_code,
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
