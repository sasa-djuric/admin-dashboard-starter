import { diskStorage } from 'multer';
import { resolve } from 'path';

export enum StorageType {
	Photos = 'photos'
}

interface Options {
	type?: StorageType;
}

export const multerConfig = ({ type }: Options = {}) => {
	const BASE_PATH = resolve(__dirname, '../../public');

	return {
		storage: diskStorage({
			destination: resolve(BASE_PATH, type ?? ''),
			filename: function (req, file, cb) {
				const extension = file.originalname.substr(file.originalname.lastIndexOf('.'));
				const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + extension;
				cb(null, fileName);
			}
		})
	};
};
