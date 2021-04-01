import { ExecutionContext } from '@nestjs/common';

export function setupContextRequest(request: any): ExecutionContext {
	return {
		switchToHttp: () => ({
			getRequest: () => request
		})
	} as ExecutionContext;
}
