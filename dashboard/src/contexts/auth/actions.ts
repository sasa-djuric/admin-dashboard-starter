import { AuthenticatedUser } from '@startup/services/users';
import { Action } from 'src/interfaces';

export enum AuthAction {
	Login = 'login',
	Logout = 'logout',
	Loading = 'loading'
}

export function loginAction<T extends AuthenticatedUser>(payload: T): Action<T> {
	return { type: AuthAction.Login, payload };
}

export function logoutAction(): Action {
	return { type: AuthAction.Logout };
}

export function authLoadingAction<T extends boolean>(payload: T): Action<T> {
	return { type: AuthAction.Loading, payload };
}

export type Actions =
	| ReturnType<typeof loginAction>
	| ReturnType<typeof logoutAction>
	| ReturnType<typeof authLoadingAction>;
