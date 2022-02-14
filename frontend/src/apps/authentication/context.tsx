import { createContext } from 'react';
import { AuthenticatedUser } from '@apps/users';
import useSlice, { createSlice, Actions } from 'react-use-slice';

interface AuthState {
	isAuth: boolean;
	user: AuthenticatedUser | null;
}

const initialState: AuthState = {
	isAuth: false,
	user: null
};

const slice = createSlice({
	name: 'authentication',
	initialState,
	reducers: {
		login(state, user: AuthenticatedUser) {
			return {
				...state,
				isAuth: true,
				user
			};
		},
		logout() {
			return initialState;
		}
	}
});

interface IAuthContext {
	state: AuthState;
	actions: Actions<typeof slice['reducers']>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

const { Provider } = AuthContext;

interface AuthProviderProps {}

const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({ children }) => {
	const [state, actions] = useSlice(slice);
	return <Provider value={{ state, actions }}>{children}</Provider>;
};

export default AuthProvider;
