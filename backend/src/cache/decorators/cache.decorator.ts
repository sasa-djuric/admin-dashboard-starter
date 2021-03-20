import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { CACHE_BY_PARAMETERS, KEY, TTL } from '../cache.constants';
import { CacheByParameters, CacheInterceptor } from '../interceptors';

export const Cache = <Query = any, Params = any, Body = any>(
	key: string,
	params?: CacheByParameters<Query, Params, Body>,
	ttl?: number
) =>
	applyDecorators(
		SetMetadata(KEY, key),
		SetMetadata(CACHE_BY_PARAMETERS, params),
		SetMetadata(TTL, ttl),
		UseInterceptors(CacheInterceptor)
	);
