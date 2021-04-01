import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthUser } from '../../modules/authentication/interfaces';
import { Permissions } from 'src/core/types';

@Injectable()
export class PermissionsGuard implements CanActivate {
	private permissions: Array<Permissions>;

	constructor(...permissions: Array<Permissions>) {
		this.permissions = permissions.flat();
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const user: AuthUser = request.user;

		if (this.permissions.every(permission => user.permissions?.includes(permission))) {
			return true;
		}

		throw new ForbiddenException();
	}
}
