import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "../constants";
import { PaginationParameters as IPaginationParameters } from "../interfaces/pagination-parameters.interface";

export class PaginationParameters implements IPaginationParameters {
	page: number;
	limit: number;

	constructor(parameters?: Partial<IPaginationParameters>) {
		this.page = parameters?.page ?? DEFAULT_PAGE;
		this.limit = parameters?.limit ?? DEFAULT_PAGE_LIMIT;
	}
}
