import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { projectConfig } from 'src/config/project';
import { Photo } from './photo.entity';
import { PhotosService } from './photos.service';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Photo]), ConfigModule.forFeature(projectConfig)],
	providers: [PhotosService],
	exports: [TypeOrmModule, ConfigModule, PhotosService]
})
export class PhotosModule {}
