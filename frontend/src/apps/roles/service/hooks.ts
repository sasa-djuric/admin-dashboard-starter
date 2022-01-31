import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
	UseQueryOptions,
	UseQueryResult
} from 'react-query';
import { Role } from '.';
import { ID, RemoveResponse, PaginatedResponse, Search, Sorting, WithFilters } from '@services';
import rolesService from './service';

const CACHE_NAMESPACE = 'roles';

enum Query {
	Role = 'role',
	Roles = 'roles',
	RolesPaginated = 'roles-paginated',
	CreateRole = 'create-role',
	UpdateRole = 'update-role',
	RemoveRole = 'remove-role'
}

type UseRolesFilters = Partial<Sorting & Search>;
type UseRolesOptions = Omit<
	UseQueryOptions<Role[], unknown, Role[], any[]>,
	'queryKey' | 'queryFn'
>;
type UseRolesResult = UseQueryResult<Role[], unknown> & { roles?: Role[] };

export function useRoles(options?: UseRolesOptions): UseRolesResult;
export function useRoles(filters: UseRolesFilters, options: UseRolesOptions): UseRolesResult;
export function useRoles(
	filters?: UseRolesOptions | UseRolesFilters,
	options?: UseRolesOptions
): UseRolesResult {
	const query = useQuery(
		[CACHE_NAMESPACE, Query.Roles, filters],
		() => rolesService.getAll(options ? (filters as UseRolesFilters) : undefined),
		(options ? options : filters) as UseRolesOptions
	);

	return { roles: query.data, ...query };
}

export function useRolesPaginated(
	filters: WithFilters<any>,
	options?: Omit<
		UseQueryOptions<PaginatedResponse<Role[]>, unknown, PaginatedResponse<Role[]>, string[]>,
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
	options?: Omit<
		UseQueryOptions<Role, unknown, Role, (string | number)[]>,
		'queryKey' | 'queryFn'
	>
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
		'mutationFn' | 'mutationKey'
	>
) {
	const queryClient = useQueryClient();
	const query = useMutation([CACHE_NAMESPACE, Query.CreateRole], rolesService.create, {
		...options,
		onSuccess: (result, variables, context) => {
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.Roles]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.RolesPaginated]);
			queryClient.setQueryData([CACHE_NAMESPACE, Query.Role, result.id], result);
			return options?.onSuccess?.(result, variables, context);
		}
	});

	return { createRole: query.mutateAsync, ...query };
}

export function useUpdateRole(
	options?: Omit<
		UseMutationOptions<Role, unknown, Partial<Role>, unknown>,
		'mutationFn' | 'mutationKey'
	>
) {
	const queryClient = useQueryClient();
	const query = useMutation([CACHE_NAMESPACE, Query.UpdateRole], rolesService.update, {
		...options,
		onSuccess: (result, variables, context) => {
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.RolesPaginated]);
			queryClient.setQueryData<Role[] | undefined>([CACHE_NAMESPACE, Query.Roles], data =>
				data?.map(user => (user.id === result.id ? result : user))
			);
			queryClient.setQueryData([CACHE_NAMESPACE, Query.Role, result.id], result);
			return options?.onSuccess?.(result, variables, context);
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
		onSuccess: (result, variables, context) => {
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.Roles]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.RolesPaginated]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.Role, result.id]);
			return options?.onSuccess?.(result, variables, context);
		}
	});

	return { removeRole: query.mutateAsync, ...query };
}
