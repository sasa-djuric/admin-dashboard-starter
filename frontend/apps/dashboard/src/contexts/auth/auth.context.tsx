import { createContext, Dispatch, useMemo, useReducer } from 'react';
import { Actions } from './actions';
import authReducer, { AuthState, initialAuthState } from './reducer';

type AuthProviderValue = [AuthState, Dispatch<Actions>];

export const AuthContext = createContext<AuthProviderValue>([initialAuthState, () => {}]);

const { Provider } = AuthContext;

interface AuthProviderProps {}

const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialAuthState);
	const value: AuthProviderValue = useMemo(() => [state, dispatch], [state]);

	return <Provider value={value}>{children}</Provider>;
};

export default AuthProvider;
