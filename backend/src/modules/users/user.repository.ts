import { FiltersDto } from '../../core/dto';
import { ID, WithFilters } from '../../core/types';
import { applyFiltersAndExecute } from '../../core/utils';
import { EntityRepository, Repository } from 'typeorm';
import { Photo } from '../photos/photo.entity';
import { Role } from '../roles/role.entity';
import { UserWithPermissions } from './interface';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	public findOneWithPermissions(
		conditions,
		withPassword?: boolean
	): Promise<UserWithPermissions> {
		const query = this.createQueryBuilder('user')
			.select([
				'user.id as id',
				'user.email as email',
				'user.password as password',
				'user.name as name',
				'user.isActive as isActive',
				'user.isActivated as isActivated',
				'user.roleId as roleId',
				'role.permissions as permissions',
				'photo.url as profileImage'
			])
			.leftJoin(Role, 'role', 'user.roleId = role.id')
			.leftJoin(Photo, 'photo', 'user.profileImageId = photo.id')
			.where(conditions);

		if (withPassword) {
			query.addSelect('password');
		}

		return query
			.limit(1)
			.execute()
			.then(result => {
				return { ...result[0], permissions: JSON.parse(result[0].permissions) };
			});
	}

	async findOneUser(id?: ID) {
		return this.createQueryBuilder('user')
			.select([
				'user.id as id',
				'user.email as email',
				'user.password as password',
				'user.name as name',
				'user.isActive as isActive',
				'user.roleId as roleId',
				'photo.url as profileImage'
			])
			.leftJoin(Photo, 'photo', 'user.profileImageId = photo.id')
			.where({ id })
			.limit(1)
			.execute()
			.then(result => result[0]);
	}

	findAll(filters?: FiltersDto): Promise<WithFilters<Array<User>>> {
		const query = this.createQueryBuilder().select('*');
		return applyFiltersAndExecute(query, filters);
	}
}
