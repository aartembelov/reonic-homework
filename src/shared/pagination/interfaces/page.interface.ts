export interface Page<T> {
	page: number;
	limit: number;
	data: T[];
}
