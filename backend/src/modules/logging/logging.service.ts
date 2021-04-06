import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogLevel } from './log-level.enum';
import { Log } from './log.entity';

@Injectable()
export class LoggingService extends Logger {
	constructor(@InjectRepository(Log) private readonly logRepository?: Repository<Log>) {
		super();
	}

	public log(message: any, context?: string) {
		super.log(message, context);
		this.create(LogLevel.Log, message, context);
	}

	public warn(message: any, context?: string) {
		super.warn(message, context);
		this.create(LogLevel.Warn, message, context);
	}

	public error(message: any, trace?: string, context?: string) {
		super.error(message, trace, context);
		this.create(LogLevel.Error, message, context, trace);
	}

	private create(level: LogLevel, message: any, context?: string, trace?: string) {
		const filterContexts = ['RouterExplorer', 'RoutesResolver'];
		const finalContext = context || this.context;

		if (filterContexts.some(ctx => ctx === finalContext)) {
			return;
		}

		this.logRepository.insert({
			level,
			message,
			context: finalContext,
			trace
		});
	}
}
