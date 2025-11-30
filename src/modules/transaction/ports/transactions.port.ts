export interface TransactionsPort {
	executeTransaction<T = unknown>(callback: (transaction: unknown) => Promise<T>): Promise<T>;
}
