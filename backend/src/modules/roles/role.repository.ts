import { EntityRepository, Repository } from 'typeorm';
import { FiltersDto } from '../../dto/filters.dto';
import { WithFilters } from '../../types';
import { applyFiltersAndExecute } from '../../utils';
import { Role } from './role.entity';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
	findAll(filters?: FiltersDto): Promise<WithFilters<Array<Role>>> {
		const query = this.createQueryBuilder().select('*');
		return applyFiltersAndExecute(query, filters, {
			transform: result => result.map(role => ({ ...role, permissions: JSON.parse(role.permissions) }))
		});
	}
}
