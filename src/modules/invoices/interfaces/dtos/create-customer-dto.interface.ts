export interface CreateCustomerDto {
	name: string;
	email: string;
	address?: {
		street?: string;
		city?: string;
		postalCode?: string;
		country?: string;
	};
}
