export interface CreateCustomerDto {
	name: string;
	email: string;
	address?: {
		street?: string;
		city?: string;
		postal_code?: string;
		country?: string;
	};
}
