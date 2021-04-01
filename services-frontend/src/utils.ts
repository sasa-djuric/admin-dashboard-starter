export const toFormData = (data: Record<any, any>) => {
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]: any) => {
		formData.append(key, value);
	});

	return formData;
};
