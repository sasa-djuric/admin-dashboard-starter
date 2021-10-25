import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { INVALIDATE_BY_PARAMETERS, INVALIDATE_OPTIONS, KEY } from '../cache.constants';
import { InvalidateInterceptor } from '../interceptors';
import { InvalidateOptions } from '../interfaces';
import { ByParameters, CacheKey } from '../types';

export const InvalidateCache = <Query = any, Params = any, Body = any, Response = any>(
	key: CacheKey,
	params?: ByParameters<Query, Params, Body, Response>,
	options?: InvalidateOptions
) =>
	applyDecorators(
		SetMetadata(KEY, key),
		SetMetadata(INVALIDATE_BY_PARAMETERS, params),
		SetMetadata(INVALIDATE_OPTIONS, options),
		UseInterceptors(InvalidateInterceptor)
	);
