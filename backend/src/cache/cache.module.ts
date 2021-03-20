import * as redisStore from 'cache-manager-redis-store';
import { Module, CacheModule as CacheModuleOrigin, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
	imports: [
		CacheModuleOrigin.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				store: redisStore,
				host: configService.get('redis.host'),
				port: configService.get('redis.port'),
				ttl: 120
			})
		})
	],
	exports: [CacheModuleOrigin]
})
export class CacheModule {}
