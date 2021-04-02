import { CACHE_MANAGER, CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CACHE_BY_PARAMETERS, KEY, TTL } from '../cache.constants';

interface CacheByParametersParams<Query, Params, Body> {
	query: Query;
	params: Params;
	body: Body;
}

export type CacheByParameters<Query = any, Params = any, Body = any> = (
	params: CacheByParametersParams<Query, Params, Body>
) => string | number;

const REFLECTOR = 'Reflector';

@Injectable()
export class CacheInterceptor<Query, Params, Body> implements NestInterceptor {
	constructor(
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		@Inject(REFLECTOR) protected readonly reflector: Reflector
	) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const { method, query, params, body }: Request = context.switchToHttp().getRequest();
		const key = this.reflector.get(KEY, context.getHandler());
		const cacheByParameters: CacheByParameters = this.reflector.get(CACHE_BY_PARAMETERS, context.getHandler());
		const ttl: number = this.reflector.get(TTL, context.getHandler());
		const cacheParam = cacheByParameters({ query, params, body });
		const cacheKey = cacheParam ? `${key}:${cacheParam}` : key;

		if (method === 'GET') {
			const cached = await this.cacheManager.get(cacheKey);

			if (cached) {
				return of(cached);
			}
		}

		return next.handle().pipe(
			map(response => {
				if (response) {
					switch (method) {
						case 'GET':
						case 'POST':
						case 'PUT':
							this.cacheManager.set(cacheKey, response, ttl);
							break;
						case 'DELETE':
							this.cacheManager.del(cacheKey);
							break;
						default:
					}
				}

				return response;
			})
		);
	}
}
