interface PickFileOptions {
	multiple: boolean;
	accept?: string;
}

type PickFileReturn<T extends PickFileOptions> = T['multiple'] extends true
	? Array<File>
	: T['multiple'] extends false
	? File
	: never;

export const pickFile = <T extends PickFileOptions>(options?: T): Promise<PickFileReturn<T>> => {
	return new Promise<PickFileReturn<T>>((resolve, reject) => {
		const el = document.createElement('input');

		el.type = 'file';
		el.style.display = 'none';

		if (options?.multiple) {
			el.setAttribute('multiple', '');
		}

		if (options?.accept) {
			el.setAttribute('accept', options.accept);
		}

		el.addEventListener('change', e => {
			const target = e?.target as HTMLInputElement | null;

			if (target?.files) {
				const result = options?.multiple ? Array.from(target.files) : target.files[0];
				resolve(result as PickFileReturn<T>);
			}

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
