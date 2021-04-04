import { AuthenticatedUser } from '@app/services/users';
import { Actions, AuthAction } from './actions';

export interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
  user: AuthenticatedUser | null;
}

export const initialAuthState: AuthState = {
  isAuth: false,
  isLoading: false,
  user: null,
};

function authReducer(state: AuthState, action: Actions) {
  switch (action.type) {
    case AuthAction.Login:
      return {
        ...state,
        isAuth: true,
        isLoading: false,
        user: action.payload,
      };
    case AuthAction.Logout:
      return initialAuthState;
    case AuthAction.Loading:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

export default authReducer;
