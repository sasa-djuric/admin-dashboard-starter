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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INVALIDATE_BY_PARAMETERS, INVALIDATE_OPTIONS, KEY } from '../cache.constants';
import { InvalidateOptions } from '../interfaces';
import { ByParameters } from '../types';
import { generateKey } from '../utils';

const REFLECTOR = 'Reflector';

@Injectable()
export class InvalidateInterceptor<Query, Params, Body, Response> implements NestInterceptor {
	constructor(
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		@Inject(REFLECTOR) protected readonly reflector: Reflector
	) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const request: Request = context.switchToHttp().getRequest();
		const { query, params, body } = request;
		const key = this.reflector.get(KEY, context.getHandler());
		const invalidateByParameters: ByParameters = this.reflector.get(
			INVALIDATE_BY_PARAMETERS,
			context.getHandler()
		);
		const options: InvalidateOptions = this.reflector.get(
			INVALIDATE_OPTIONS,
			context.getHandler()
		);

		return next.handle().pipe(
			map(async response => {
				if (response) {
					const invalidateParam = invalidateByParameters?.({
						query,
						params,
						body,
						request,
						response
					});
					const invalidateKey = generateKey(key, invalidateParam);
					this.cacheManager.del(invalidateKey);
				}

				return response;
			})
		);
	}
}
