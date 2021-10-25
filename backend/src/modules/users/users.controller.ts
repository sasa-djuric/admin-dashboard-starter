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
import { Cache, InvalidateCache } from '../../core/cache';

const CACHE_NAMESPACE = 'users';
const TTL = 24 * 60 * 60;

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
	@Cache<any, IdParamDto>(CACHE_NAMESPACE, ({ params }) => params.id, TTL)
	@ApiParam({ name: 'id', required: true })
	getById(@Param() params: IdParamDto): Promise<User> {
		return this.usersService.getById(params.id);
	}

	@Post('/')
	@UseInterceptors(FileInterceptor('profileImage', multerConfig({ type: StorageType.Photos })))
	@Cache<any, any, any, UserResponse>(CACHE_NAMESPACE, ({ response }) => response.id, TTL)
	create(
		@Body() data: CreateDto,
		@UploadedFile() profileImage: Express.Multer.File
	): Promise<UserResponse> {
		return this.usersService.create({ ...data, profileImage });
	}

	@Put('/:id')
	@UseInterceptors(FileInterceptor('profileImage', multerConfig({ type: StorageType.Photos })))
	@Cache<any, IdParamDto>(CACHE_NAMESPACE, ({ params }) => params.id, TTL)
	@ApiParam({ name: 'id', required: true })
	update(
		@Param() params: IdParamDto,
		@Body() data: UpdateDto,
		@UploadedFile() profileImage: Express.Multer.File
	): Promise<UserResponse> {
		return this.usersService.update(+params.id, { ...data, profileImage });
	}

	@Delete('/:id')
	@InvalidateCache<any, IdParamDto>(CACHE_NAMESPACE, ({ params }) => params.id)
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
