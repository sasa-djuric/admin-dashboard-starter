import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfig } from './config/app';
import { Repository } from 'typeorm';
import { Role } from './modules/roles/role.entity';
import { UserRepository } from './modules/users/user.repository';

@Injectable()
export class AppService {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		private readonly userRepository: UserRepository,
		private readonly configService: ConfigService
	) {}

	private async isFirstRun() {
		return this.userRepository.count().then(result => !result);
	}

	public async handleFirstRun() {
		const appConfig = this.configService.get<AppConfig>('app');
		const isFirstRun = await this.isFirstRun();

		if (!isFirstRun) {
			return;
		}

		const entities = ['roles', 'users'];
		const permissions = ['create', 'read', 'update', 'delete'];
		const allPermissions = entities.flatMap(entity =>
			permissions.map(permission => `${entity}:${permission}`)
		);
		const existingRole = await this.roleRepository.findOne({
			name: 'Admin'
		});

		let role: Role;

		if (existingRole) {
			role = existingRole;
		} else {
			role = this.roleRepository.create({
				name: 'Admin',
				isActive: true,
				permissions: allPermissions
			});

			await this.roleRepository.insert(role);
		}

		return this.userRepository.insert({
			email: appConfig.userEmail,
			name: appConfig.userName,
			password: appConfig.userPassword,
			roleId: role.id,
			isActive: true,
			isActivated: true
		});
	}
}
