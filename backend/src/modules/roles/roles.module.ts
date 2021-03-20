import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
	imports: [TypeOrmModule.forFeature([RoleRepository])],
	providers: [RolesService],
	controllers: [RolesController]
})
export class RolesModule {}
