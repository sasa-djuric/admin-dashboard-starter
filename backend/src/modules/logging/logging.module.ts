import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { LoggingService } from './logging.service';

@Module({
	imports: [TypeOrmModule.forFeature([Log])],
	providers: [LoggingService],
	exports: [LoggingService]
})
export class LoggingModule {}
