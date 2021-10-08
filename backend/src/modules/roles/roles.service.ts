import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FiltersDto } from '../../core/dto/filters.dto';
import { ID, WithFilters } from '../../core/types';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RolesService {
	constructor(
		@InjectRepository(RoleRepository) private readonly roleRepository: RoleRepository
	) {}

	async getAll(filters?: FiltersDto): Promise<WithFilters<Array<Role>>> {
		return this.roleRepository.findAll(filters);
	}

	async getById(id: ID): Promise<Role> {
		const role = await this.roleRepository.findOne(id);

		if (!role) {
			throw new NotFoundException(`Role with ID ${id} not found`);
		}

		return role;
	}

	async create(data: CreateRoleDto): Promise<Role> {
		const createdRole = this.roleRepository.create(data);

		await this.roleRepository.insert(createdRole);

		return createdRole;
	}

	async update(id: ID, data: UpdateRoleDto): Promise<Role> {
		const updatedRole = await this.roleRepository.update(id, data);

		if (!updatedRole.affected) {
			throw new NotFoundException(`Role with ID ${id} not found`);
		}

		return this.roleRepository.findOne(id);
	}

	async remove(id: ID): Promise<{ id: ID }> {
		try {
			const removedRole = await this.roleRepository.delete(id);

			if (!removedRole.affected) {
				throw new NotFoundException(`Role with ID ${id} not found`);
			}

			return {
				id
			};
		} catch (err) {
			if (err.code === 'ER_ROW_IS_REFERENCED_2') {
				throw new ConflictException(`Role with ID ${id} is used in other entities`);
			}

			throw err;
		}
	}
}
