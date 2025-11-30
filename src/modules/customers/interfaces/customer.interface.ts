export interface Customer {
	id: number;
	publicId: string;
	name: string;
	email: string;
	address?: CustomerAddress;
}

export type CustomerWithoutId = Omit<Customer, "id">;

export interface CustomerAddress {
	publicId: string;
	street?: string;
	city?: string;
	postal_code?: string;
	country?: string;
}
