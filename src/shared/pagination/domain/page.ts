import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from "../constants";
import { Page as IPage } from "../interfaces/page.interface";
import { PaginationParameters } from "../interfaces/pagination-parameters.interface";

export class Page<T> implements IPage<T> {
	page: number;
	limit: number;
	data: T[];

	constructor(page: Partial<PaginationParameters> & { data: T[] }) {
		this.page = page.page ?? DEFAULT_PAGE;
		this.limit = page.limit ?? DEFAULT_PAGE_LIMIT;
		this.data = page.data;
	}
}
