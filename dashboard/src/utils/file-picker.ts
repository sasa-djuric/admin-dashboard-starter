interface PickFileOptions {
	multiple: boolean;
}

export const pickFile = (options?: PickFileOptions): Promise<File> => {
	return new Promise((resolve, reject) => {
		const el = document.createElement('input');

		el.type = 'file';
		el.style.display = 'none';

		el.addEventListener('change', e => {
			// @ts-ignore
			resolve(e?.target?.files[0]);

			el.remove();
		});

		document.body.appendChild(el);

		el.click();
	});
};

export const readFile = (file: any): Promise<string | null | undefined> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.addEventListener('load', e => {
			resolve(e?.target?.result as string | null | undefined);
		});

		reader.addEventListener('abort', reject);
		reader.addEventListener('error', reject);
		reader.readAsText(file);
	});
};
