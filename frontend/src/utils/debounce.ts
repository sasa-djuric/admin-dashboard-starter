export const debounce = <T extends (...args: any[]) => any>(fn: T, time: number) => {
	let timeout: NodeJS.Timeout | null;

	return (...args: any[]) => {
		clearTimeout(timeout!);

		timeout = setTimeout(() => {
			timeout = null;
			fn(...args);
		}, time);
	};
};
