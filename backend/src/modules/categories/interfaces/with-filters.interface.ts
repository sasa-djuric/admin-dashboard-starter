interface WithPagination<T> {
	metadata: {
		total: number;
	};
	data: T;
}

export default WithPagination;
