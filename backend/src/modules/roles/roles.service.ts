import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FiltersDto } from 'src/dto/filters.dto';
import { ID, WithFilters } from 'src/types';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RolesService {
	constructor(@InjectRepository(RoleRepository) private readonly roleRepository: RoleRepository) {}

	async getAll(filters?: FiltersDto): Promise<WithFilters<Array<Role>>> {
		return this.roleRepository.findAll(filters);
	}

	async getById(id: ID) {
		try {
			const result = await this.roleRepository.findOneOrFail({ id });
			return result;
		} catch {
			throw new NotFoundException(`Role with ID ${id} not found`);
		}
	}

	async create(data: CreateRoleDto) {
		const created = this.roleRepository.create(data);

		await this.roleRepository.insert(created);

		return created;
	}

	async update(id: ID, data: UpdateRoleDto) {
		const updated = await this.roleRepository.update(id, data);

		if (!updated.affected) {
			throw new NotFoundException(`Role with ID ${id} not found`);
		}

		return updated.raw[0];
	}

	async remove(id: ID) {
		try {
			const removed = await this.roleRepository.delete(id);

			if (!removed.affected) {
				throw new NotFoundException(`Role with ID ${id} not found`);
			}

			return {
				id
			};
		} catch (err) {
			if (err.code === 'ER_ROW_IS_REFERENCED_2') {
				throw new ConflictException(`Role with ID ${id} is used in other entities`);
			}
		}
	}
}
