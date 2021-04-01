import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator((cookieKey: string, context: ExecutionContext) => {
	const request: Request = context.switchToHttp().getRequest();

	if (cookieKey) {
		return request.cookies?.[cookieKey] ?? null;
	}

	return request.cookies;
});
