import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ProjectConfig } from 'src/config/project';
import { StorageType } from '../../config/multer';
import { ID } from '../../core/types';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PhotosService {
	constructor(
		@InjectRepository(Photo)
		private readonly photoRepository: Repository<Photo>,
		private readonly configService: ConfigService
	) {}
	private readonly BASE_URL = `http://api.${this.configService.get<ProjectConfig>('project').domain}`;
	private readonly PHOTOS_URL = `${this.BASE_URL}/${StorageType.Photos}`;

	public async create(file: Express.Multer.File): Promise<Photo> {
		const createdPhoto = this.photoRepository.create({
			originalName: file.originalname.substr(0, file.originalname.lastIndexOf('.')),
			extension: file.originalname.substr(file.originalname.lastIndexOf('.') + 1),
			filename: file.filename,
			url: `${this.PHOTOS_URL}/${file.filename}`
		});

		await this.photoRepository.insert(createdPhoto);

		return createdPhoto;
	}

	public async update(id: ID, file: Express.Multer.File): Promise<Photo> {
		const existingPhoto = await this.photoRepository.findOne(id);
		const updatedPhoto = await this.photoRepository.update(id, {
			originalName: file.originalname.substr(0, file.originalname.lastIndexOf('.')),
			extension: file.originalname.substr(file.originalname.lastIndexOf('.') + 1),
			filename: file.filename,
			url: `${this.PHOTOS_URL}/${file.filename}`
		});

		this.unlink(existingPhoto.filename);

		return updatedPhoto.raw[0];
	}

	public async remove(id: ID) {
		try {
			const existingPhoto = await this.photoRepository.findOne(id);

			await this.photoRepository.delete(id);

			this.unlink(existingPhoto.filename);

			return {
				id
			};
		} catch {
			new BadRequestException(`Photo with ID ${id} not found`);
		}
	}

	private unlink(filename: string) {
		fs.unlink(path.resolve(__dirname, '../../../public', StorageType.Photos, filename), () => {});
	}
}
