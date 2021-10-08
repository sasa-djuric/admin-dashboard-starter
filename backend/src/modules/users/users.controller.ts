import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FiltersDto, IdParamDto } from '../../core/dto';
import { AuthenticationGuard } from '../../core/guards';
import { ID, WithFilters } from '../../core/types';
import { CreateDto, UpdateDto, SwitchRoleDto } from './dto';
import { UserResponse } from './interface';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { multerConfig, StorageType } from '../../config/multer';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('users')
@UseGuards(AuthenticationGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/')
	@ApiQuery({ name: 'filters', required: false })
	getAll(@Query() filters: FiltersDto): Promise<WithFilters<Array<User>>> {
		return this.usersService.getAll(filters);
	}

	@Get('/:id')
	@ApiParam({ name: 'id', required: true })
	getById(@Param() params: IdParamDto): Promise<User> {
		return this.usersService.getById(params.id);
	}

	@Post('/')
	@UseInterceptors(FileInterceptor('profileImage', multerConfig({ type: StorageType.Photos })))
	create(
		@Body() data: CreateDto,
		@UploadedFile() profileImage: Express.Multer.File
	): Promise<UserResponse> {
		return this.usersService.create({ ...data, profileImage });
	}

	@Put('/:id')
	@ApiParam({ name: 'id', required: true })
	@UseInterceptors(FileInterceptor('profileImage', multerConfig({ type: StorageType.Photos })))
	@ApiParam({ name: 'id', required: true })
	update(
		@Param() params: IdParamDto,
		@Body() data: UpdateDto,
		@UploadedFile() profileImage: Express.Multer.File
	): Promise<UserResponse> {
		return this.usersService.update(+params.id, { ...data, profileImage });
	}

	@Delete('/:id')
	@ApiParam({ name: 'id', required: true })
	remove(@Param() params: IdParamDto): Promise<{ id: ID }> {
		return this.usersService.remove(params.id);
	}

	@Post('/role/switch')
	switchRole(@Body() data: SwitchRoleDto): Promise<void> {
		if (data.id === data.roleId) {
			throw new BadRequestException('Two roles cannot be the same');
		}

		return this.usersService.switchRole(data);
	}
}
