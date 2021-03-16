export const NotFoundException = (message: string = 'Not found') => {
	return {
		message
	};
};

export const UnauthorizedException = (message: string = 'Unauthorized') => {
	return {
		message
	};
};
