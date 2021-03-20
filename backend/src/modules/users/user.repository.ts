import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../roles/role.entity';
import { UserWithPermissions } from './interface/user-with-permissions.interface';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	public findOneWithPermissions(conditions): Promise<UserWithPermissions> {
		return this.createQueryBuilder('user')
			.leftJoin(Role, 'role', 'user.roleId = role.id')
			.select([
				'user.id as id',
				'user.email as email',
				'user.password as password',
				'user.name as name',
				'role.permissions as permissions'
			])
			.where(conditions)
			.execute()
			.then(result => {
				return { ...result[0], permissions: JSON.parse(result[0].permissions) };
			});
	}
}
