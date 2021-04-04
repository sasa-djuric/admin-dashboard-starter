// Libs
import { Route, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import { AppRoutes } from './lib/routing';

// Containers
import AppShell from './templates/app-shell';
import UnauthenticatedApp from './app-unauth';

// Views
import DashboardView from './views/dashboard';

// Assets
import apps from './apps/index';

// Hooks
import useAuth from './hooks/use-auth';

// Services
import { http } from '@app/services';
import { refreshToken } from './services/authentication.service';

function App() {
  const { authState, logout, updateAuthState } = useAuth();

  function onInit() {
    http.addListener(http.Event.TokenRefresh, async () => {
      const token = await refreshToken();
      await updateAuthState();
      return token;
    });

    http.addListener(http.Event.Unauthorized, logout);
  }

  useEffect(onInit, []);

  if (!authState.isAuth) return <UnauthenticatedApp />;

  return (
    <div>
      <AppShell>
        <Switch>
          <Route path="/" exact={true} component={DashboardView} />
          <AppRoutes apps={apps} />
        </Switch>
      </AppShell>
    </div>
  );
}

export default App;
