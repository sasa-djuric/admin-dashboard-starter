import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { CACHE_BY_PARAMETERS, KEY, TTL } from '../cache.constants';
import { CacheInterceptor } from '../interceptors';
import { ByParameters, CacheKey } from '../types';

export const Cache = <Query = any, Params = any, Body = any, Response = any>(
	key: CacheKey,
	params?: ByParameters<Query, Params, Body, Response>,
	ttl?: number
) =>
	applyDecorators(
		SetMetadata(KEY, key),
		SetMetadata(CACHE_BY_PARAMETERS, params),
		SetMetadata(TTL, ttl),
		UseInterceptors(CacheInterceptor)
	);
