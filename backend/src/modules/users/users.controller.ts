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
import { FiltersDto, IdParamDto } from 'src/dto';
import { AuthenticationGuard } from 'src/guards';
import { ID, WithFilters } from 'src/types';
import { CreateDto, UpdateDto, SwitchRoleDto } from './dto';
import { UserResponse } from './interface';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { multerConfig, StorageType } from 'src/config/multer';

@Controller('users')
@UseGuards(AuthenticationGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/')
	getAll(@Query() filters: FiltersDto): Promise<WithFilters<Array<User>>> {
		return this.usersService.getAll(filters);
	}

	@Get('/:id')
	getById(@Param() params: IdParamDto): Promise<User> {
		return this.usersService.getById(params.id);
	}

	@Post('/')
	@UseInterceptors(FileInterceptor('profileImage', multerConfig({ type: StorageType.Photos })))
	create(@Body() data: CreateDto, @UploadedFile() profileImage: Express.Multer.File): Promise<UserResponse> {
		return this.usersService.create({ ...data, profileImage });
	}

	@Put('/:id')
	@UseInterceptors(FileInterceptor('profileImage', multerConfig({ type: StorageType.Photos })))
	update(@Param() params: IdParamDto, @Body() data: UpdateDto): Promise<UserResponse> {
		return this.usersService.update(+params.id, data);
	}

	@Delete('/:id')
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
