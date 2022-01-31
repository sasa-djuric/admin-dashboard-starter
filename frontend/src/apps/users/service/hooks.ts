import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
	UseQueryOptions,
	UseQueryResult
} from 'react-query';
import { User } from '.';
import { ID, RemoveResponse, PaginatedResponse, Search, Sorting, WithFilters } from '@services';
import usersService, { SwithRoleRequest } from './service';

const CACHE_NAMESPACE = 'users';

enum Query {
	Users = 'users',
	UsersPaginated = 'users-paginated',
	User = 'user',
	CreateUser = 'create-user',
	UpdateUser = 'update-user',
	RemoveUser = 'remove-user',
	SwitchUserRole = 'switch-user-role'
}

type UseUsersFilters = Partial<Sorting & Search>;
type UseUsersOptions = Omit<
	UseQueryOptions<User[], unknown, User[], any[]>,
	'queryKey' | 'queryFn'
>;
type UseUsersResult = UseQueryResult<User[]> & { users?: User[] };

export function useUsers(options?: UseUsersOptions): UseUsersResult;
export function useUsers(filters: UseUsersFilters, options: UseUsersOptions): UseUsersResult;
export function useUsers(
	filters?: UseUsersFilters | UseUsersOptions,
	options?: UseUsersOptions
): UseUsersResult {
	const query = useQuery(
		[CACHE_NAMESPACE, Query.Users, filters],
		() => usersService.getAll(options ? (filters as UseUsersFilters) : undefined),
		(options ? options : filters) as UseUsersOptions
	);

	return { users: query.data, ...query };
}

export function useUsersPaginated(
	filters: WithFilters<any>,
	options?: Omit<
		UseQueryOptions<PaginatedResponse<User[]>, unknown, PaginatedResponse<User[]>, string[]>,
		'queryKey' | 'queryFn'
	>
) {
	const query = useQuery(
		[CACHE_NAMESPACE, Query.UsersPaginated, filters],
		() => usersService.getAllPaginated(filters),
		options
	);

	return { users: query.data, ...query };
}

export function useUserById(
	id: ID,
	options?: Omit<
		UseQueryOptions<User, unknown, User, (string | number)[]>,
		'queryKey' | 'queryFn'
	>
) {
	const query = useQuery(
		[CACHE_NAMESPACE, Query.User, id],
		() => usersService.getById(id),
		options
	);

	return { user: query.data, ...query };
}

export function useCreateUser(
	options?: Omit<
		UseMutationOptions<User, unknown, Omit<User, 'id'>, unknown>,
		'mutationFn' | 'mutationKey'
	>
) {
	const queryClient = useQueryClient();
	const query = useMutation([CACHE_NAMESPACE, Query.CreateUser], usersService.create, {
		...options,
		onSuccess: (result, variables, context) => {
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.Users]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.UsersPaginated]);
			queryClient.setQueryData([CACHE_NAMESPACE, Query.User, result.id], result);
			return options?.onSuccess?.(result, variables, context);
		}
	});

	return { createUser: query.mutateAsync, ...query };
}

export function useUpdateUser(
	options?: Omit<
		UseMutationOptions<User, unknown, Partial<User>, unknown>,
		'mutationFn' | 'mutationKey'
	>
) {
	const queryClient = useQueryClient();
	const query = useMutation([CACHE_NAMESPACE, Query.UpdateUser], usersService.update, {
		...options,
		onSuccess: (result, variables, context) => {
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.UsersPaginated]);
			queryClient.setQueryData<User[] | undefined>([CACHE_NAMESPACE, Query.Users], data =>
				data?.map(user => (user.id === result.id ? result : user))
			);
			queryClient.setQueryData([CACHE_NAMESPACE, Query.User, result.id], result);
			return options?.onSuccess?.(result, variables, context);
		}
	});

	return { updateUser: query.mutateAsync, ...query };
}

export function useRemoveUser(
	options?: Omit<
		UseMutationOptions<RemoveResponse, unknown, ID, unknown>,
		'mutationFn' | 'mutationKey'
	>
) {
	const queryClient = useQueryClient();
	const query = useMutation([CACHE_NAMESPACE, Query.RemoveUser], usersService.remove, {
		...options,
		onSuccess: (result, variables, context) => {
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.Users]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.UsersPaginated]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.User, result.id]);
			return options?.onSuccess?.(result, variables, context);
		}
	});

	return { removeUser: query.mutateAsync, ...query };
}

export function useSwitchUserRole(
	options?: Omit<
		UseMutationOptions<void, unknown, SwithRoleRequest, unknown>,
		'mutationFn' | 'mutationKey'
	>
) {
	const queryClient = useQueryClient();
	const query = useMutation([CACHE_NAMESPACE, Query.SwitchUserRole], usersService.swithRole, {
		...options,
		onSuccess: (result, variables, context) => {
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.Users]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.UsersPaginated]);
			queryClient.invalidateQueries([CACHE_NAMESPACE, Query.User, variables.id]);
			return options?.onSuccess?.(result, variables, context);
		}
	});

	return { switchUserRole: query.mutateAsync, ...query };
}
