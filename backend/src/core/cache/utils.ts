import { CacheKey } from './types';

export const generateKey = (key: CacheKey, additional?: CacheKey) => {
	const toString = (param?: CacheKey) =>
		typeof param === 'number'
			? param.toString()
			: typeof param === 'string'
			? param
			: param?.join(':');
	const _key = toString(key);
	const _additional = toString(additional);
	return _additional ? `${_key}:${_additional}` : _key;
};
