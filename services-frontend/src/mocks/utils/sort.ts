export const sort = (data: any[], field: string, order: any) => {
	const orderInt = order === 'asc' ? 1 : -1;

	return data.sort((a, b) => {
		if (a[field!] > b[field!]) {
			return orderInt;
		} else if (a[field!] < b[field!]) {
			return orderInt * -1;
		}
		return 0;
	});
};
