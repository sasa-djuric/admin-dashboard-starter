import {
	CACHE_MANAGER,
	CallHandler,
	ExecutionContext,
	Inject,
	Injectable,
	NestInterceptor
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CACHE_BY_PARAMETERS, KEY, TTL } from '../cache.constants';
import { ByParameters } from '../types';
import { generateKey } from '../utils';

const REFLECTOR = 'Reflector';

@Injectable()
export class CacheInterceptor<Query, Params, Body> implements NestInterceptor {
	constructor(
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		@Inject(REFLECTOR) protected readonly reflector: Reflector
	) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const request: Request = context.switchToHttp().getRequest();
		const { method, query, params, body } = request;
		const key = this.reflector.get(KEY, context.getHandler());
		const cacheByParameters: ByParameters = this.reflector.get(
			CACHE_BY_PARAMETERS,
			context.getHandler()
		);
		const ttl: number = this.reflector.get(TTL, context.getHandler());

		if (method === 'GET') {
			const cacheParam = cacheByParameters?.({ query, params, body, request });
			const cacheKey = generateKey(key, cacheParam);
			const cached = await this.cacheManager.get(cacheKey);

			if (cached) {
				return of(cached);
			}
		}

		return next.handle().pipe(
			map(response => {
				if (response) {
					const cacheParamWithResponse = cacheByParameters?.({
						query,
						params,
						body,
						request,
						response
					});
					const cacheKeyWithRepsonse = generateKey(key, cacheParamWithResponse);

					switch (method) {
						case 'GET':
							this.cacheManager.set(cacheKeyWithRepsonse, response, ttl);
							break;
						case 'POST':
						case 'PUT':
							this.cacheManager.set(cacheKeyWithRepsonse, response, ttl);
							break;
						default:
					}
				}

				return response;
			})
		);
	}
}
