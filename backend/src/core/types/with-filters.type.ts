interface WithPagination<T> {
	metadata: {
		total: number;
	};
	data: T;
}

export type WithFilters<Return> = Return | WithPagination<Return>;
