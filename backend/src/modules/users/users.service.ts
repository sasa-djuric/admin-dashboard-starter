import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ID } from 'src/types';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

	public async getById(id: ID) {
		const user = await this.userRepository.findOneWithPermissions(id);

		if (!user) {
			throw new BadRequestException(`User with given ID ${id} not found`);
		}

		return user;
	}
}
