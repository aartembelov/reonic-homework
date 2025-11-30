export interface Customer {
	publicId: string;
	name: string;
	email: string;
	address?: CustomerAddress;
}

export interface CustomerAddress {
	publicId: string;
	street?: string;
	city?: string;
	postal_code?: string;
	country?: string;
}
