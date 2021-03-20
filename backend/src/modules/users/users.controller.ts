import { Controller, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication.guard';

@Controller('users')
@UseGuards(AuthenticationGuard)
export class UsersController {}
