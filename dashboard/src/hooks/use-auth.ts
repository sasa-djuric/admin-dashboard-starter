import { useContext } from 'react';
import { AuthContext } from 'src/contexts/auth/auth.context';

const useAuth = () => {
	return useContext(AuthContext);
};

export default useAuth;
