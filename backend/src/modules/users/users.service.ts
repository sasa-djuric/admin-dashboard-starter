import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { ID, WithFilters } from '../../core/types';
import { CreateDto, UpdateDto } from './dto';
import { User } from './user.entity';
import { UserResponse, UserWithPermissions } from './interface';
import { AuthenticationService } from '../authentication/authentication.service';
import { SwitchRoleDto } from './dto/switch.dto';
import { PhotosService } from '../photos/photos.service';
import { Photo } from '../photos/photo.entity';
import { UpdateResult } from 'typeorm';
import { omit } from 'ramda';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserRepository) private readonly userRepository: UserRepository,
		@Inject(forwardRef(() => AuthenticationService))
		private readonly authenticationService: AuthenticationService,
		private readonly photosService: PhotosService
	) {}

	public async getAll(filters?: WithFilters<any>): Promise<WithFilters<Array<User>>> {
		return this.userRepository.findAll(filters);
	}

	public async getById(id: ID): Promise<User> {
		const user = await this.userRepository.findOneUser(id);

		if (!user) {
			throw new BadRequestException(`User with given ID ${id} not found`);
		}

		return user;
	}

	public async getByIdWithPermissions(id: ID): Promise<UserWithPermissions> {
		const user = await this.userRepository.findOneWithPermissions(id);

		if (!user) {
			throw new BadRequestException(`User with given ID ${id} not found`);
		}

		return user;
	}

	public async create(data: CreateDto): Promise<UserResponse> {
		let profileImage: Photo | undefined;
		let createdUser: User;

		if (data.profileImage) {
			profileImage = await this.photosService.create(data.profileImage);
			createdUser = this.userRepository.create({
				...omit(['profileImage'], data),
				profileImageId: profileImage.id
			});
		} else {
			createdUser = this.userRepository.create(data);
		}

		try {
			await this.userRepository.insert(createdUser);
			await this.authenticationService.handleAccountActivation(createdUser);
			return { ...createdUser, profileImage: profileImage?.url ?? null };
		} catch (err) {
			this.userRepository.delete({ id: createdUser.id });
			throw err;
		}
	}

	public async update(id: ID, data: UpdateDto): Promise<UserResponse> {
		let existingUser: User = await this.userRepository.findOne(id);
		let profileImage: Photo | undefined;
		let updatedUser: UpdateResult;

		if (data.profileImage) {
			if (existingUser.profileImageId) {
				profileImage = await this.photosService.update(existingUser.profileImageId, data.profileImage);
				updatedUser = await this.userRepository.update({ id }, omit(['profileImage'], data));
			} else {
				profileImage = await this.photosService.create(data.profileImage);
				updatedUser = await this.userRepository.update(
					{ id },
					{ ...omit(['profileImage'], data), profileImageId: profileImage?.id }
				);
			}
		} else {
			updatedUser = await this.userRepository.update({ id }, omit(['profileImage'], data));
		}

		if (!updatedUser.affected) {
			throw new NotFoundException(`User with given ID ${id} not found`);
		}

		return this.userRepository.findOneUser(id);
	}

	public async remove(id: ID): Promise<{ id: ID }> {
		const removedUser = await this.userRepository.delete({ id });

		if (!removedUser.affected) {
			throw new NotFoundException(`Role with ID ${id} not found`);
		}

		return {
			id
		};
	}

	public async switchRole(data: SwitchRoleDto): Promise<void> {
		await this.userRepository.update({ roleId: data.id }, { roleId: data.roleId });
	}
}
