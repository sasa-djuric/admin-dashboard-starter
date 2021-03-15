import { Action } from 'src/interfaces';

export enum AuthAction {
	Login = 'login',
	Logout = 'logout',
	Loading = 'loading'
}

export function login<T extends any>(payload: T): Action<T> {
	return { type: AuthAction.Login, payload };
}

export function logout(): Action {
	return { type: AuthAction.Logout };
}

export function authLoading<T extends boolean>(payload: T): Action<T> {
	return { type: AuthAction.Loading, payload };
}

export type Actions = ReturnType<typeof login> | ReturnType<typeof logout> | ReturnType<typeof authLoading>;
