import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
	UseQueryOptions
} from 'react-query';
import { Role } from '.';
import { ID, RemoveResponse, ResponseWithPagination, Search, Sorting, WithFilters } from '..';
import rolesService from './roles.service';

const CACHE_NAMESPACE = 'roles';

enum Query {
	Role = 'role',
	Roles = 'roles',
	RolesPaginated = 'roles-paginated',
	CreateRole = 'create-role',
	UpdateRole = 'update-role',
	RemoveRole = 'remove-role'
}

export function useRoles(
	filters?: Partial<Sorting & Search>
	// options: Omit<UseQueryOptions<Role[], unknown, Role[], string[]>, 'queryKey' | 'queryFn'>
) {
	const query = useQuery(
		[CACHE_NAMESPACE, Query.Roles, filters],
		() => rolesService.getAll(filters)
		// options
	);

	return { roles: query.data, ...query };
}

export function useRolesPaginated(
	filters: WithFilters<any>,
	options?: Omit<
		UseQueryOptions<
			ResponseWithPagination<Role[]>,
			unknown,
			ResponseWithPagination<Role[]>,
			string[]
		>,
		'queryKey' | 'queryFn'
	>
) {
	const query = useQuery(
		[CACHE_NAMESPACE, Query.RolesPaginated, filters],
		() => rolesService.getAllPaginated(filters),
		options
	);

	return { roles: query.data, ...query };
}

export function useRoleById(
	id: ID,
	options?: Omit<UseQueryOptions<Role, unknown, Role, string[]>, 'queryKey' | 'queryFn'>
) {
	const query = useQuery(
		[CACHE_NAMESPACE, Query.Role, id],
		() => rolesService.getById(id),
		options
	);

	return { role: query.data, ...query };
}

export function useCreateRole(
	options?: Omit<
		UseMutationOptions<Role, unknown, Omit<Role, 'id'>, unknown>,
		'mutationFn' | 'mutationKey' | 'onSuccess'
	>
) {
	const queryClient = useQueryClient();
	const query = useMutation([CACHE_NAMESPACE, Query.CreateRole], rolesService.create, {
		...options,
		onSuccess: result => {
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.Roles]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.RolesPaginated]);
			queryClient.setQueryData([CACHE_NAMESPACE, Query.Role, result.id], result);
		}
	});

	return { createRole: query.mutateAsync, ...query };
}

export function useUpdateRole(
	options?: Omit<
		UseMutationOptions<Role, unknown, Partial<Role>, unknown>,
		'mutationFn' | 'mutationKey' | 'onSuccess'
	>
) {
	const queryClient = useQueryClient();
	const query = useMutation([CACHE_NAMESPACE, Query.UpdateRole], rolesService.update, {
		...options,
		onSuccess: result => {
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.RolesPaginated]);
			queryClient.setQueryData<Role[]>([CACHE_NAMESPACE, Query.Roles], data =>
				data?.map(user => (user.id === result.id ? result : user))
			);
			queryClient.setQueryData([CACHE_NAMESPACE, Query.Role, result.id], result);
		}
	});

	return { updateRole: query.mutateAsync, ...query };
}

export function useRemoveRole(
	options?: Omit<
		UseMutationOptions<RemoveResponse, unknown, ID, unknown>,
		'mutationFn' | 'mutationKey'
	>
) {
	const queryClient = useQueryClient();
	const query = useMutation([CACHE_NAMESPACE, Query.RemoveRole], rolesService.remove, {
		...options,
		onSuccess: result => {
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.Roles]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.RolesPaginated]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.Role, result.id]);
		}
	});

	return { removeRole: query.mutateAsync, ...query };
}
