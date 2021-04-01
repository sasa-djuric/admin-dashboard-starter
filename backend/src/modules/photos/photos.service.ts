import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ProjectConfig } from 'src/config/project';
import { StorageType } from '../../config/multer';
import { ID } from '../../core/types';

type UpdateCriteria = {
	[Key in keyof Photo]?: Photo[Key];
};

@Injectable()
export class PhotosService {
	constructor(
		@InjectRepository(Photo)
		private readonly photoRepository: Repository<Photo>,
		private readonly configService: ConfigService
	) {}
	private readonly BASE_URL = `http://api.${this.configService.get<ProjectConfig>('project').domain}`;
	private readonly PHOTOS_PATH = `${this.BASE_URL}/${StorageType.Photos}`;

	public async create(file: Express.Multer.File): Promise<Photo> {
		const createdPhoto = this.photoRepository.create({
			originalName: file.originalname.substr(0, file.originalname.lastIndexOf('.')),
			extension: file.originalname.substr(file.originalname.lastIndexOf('.') + 1),
			filename: file.filename,
			url: `${this.PHOTOS_PATH}/${file.filename}`
		});

		await this.photoRepository.insert(createdPhoto);

		return createdPhoto;
	}

	public async update(criteria: string | UpdateCriteria, file: Express.Multer.File): Promise<Photo> {
		const updated = await this.photoRepository.update(criteria, {
			originalName: file.originalname.substr(0, file.originalname.lastIndexOf('.')),
			extension: file.originalname.substr(file.originalname.lastIndexOf('.') + 1),
			filename: file.filename,
			url: `${this.PHOTOS_PATH}/${file.filename}`
		});

		return updated.raw[0];
	}

	public async remove(id: ID) {
		try {
			await this.photoRepository.delete(id);

			return {
				id
			};
		} catch {
			new BadRequestException(`Photo with ID ${id} not found`);
		}
	}
}
