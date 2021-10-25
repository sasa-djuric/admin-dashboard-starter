import { Request } from 'express';
import { CacheKey } from './key.type';

interface ByParametersParams<Query, Params, Body, Response> {
	query: Query;
	params: Params;
	body: Body;
	request: Request;
	response?: Response;
}

export type ByParameters<Query = any, Params = any, Body = any, Response = any> = (
	params: ByParametersParams<Query, Params, Body, Response>
) => CacheKey;
