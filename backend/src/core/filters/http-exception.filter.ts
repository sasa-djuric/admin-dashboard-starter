import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from 'src/modules/logging/logging.service';

@Catch()
export class UnhandledExceptionFilter implements ExceptionFilter {
	constructor(private readonly loggingService: LoggingService) {
		this.loggingService.setContext(UnhandledExceptionFilter.name);
	}

	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		if (exception?.status) {
			return response.status(exception.status).json(exception.response);
		}

		this.loggingService.error(exception.message, exception.stack);

		response.status(500).json({
			statusCode: 500,
			message: 'Internal server error'
		});
	}
}
