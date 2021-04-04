import React, { memo, useMemo } from 'react';
import { Switch, Redirect, useLocation } from 'react-router';
import ProtectedRoute from '../../components/protected-route';
import { App, BaseRoute, Route as RouteI } from '../../interfaces';

interface RenderAppRoutesProps {
    apps: Array<App>;
    defaultPath?: string;
}

const mapRoutes = (app: App) => (route: BaseRoute) => ({
    ...route,
    path: `${app.name ? '/' + app.name : ''}${route.path}`,
});
const flattedAppsRoutes = (app: App) => app.routes.map(mapRoutes(app));

export const AppRoutes: React.FunctionComponent<RenderAppRoutesProps> = memo(
    ({ apps, defaultPath = '/' }) => {
        const location = useLocation();
        const routes: Array<RouteI> = useMemo(
            () => apps.flatMap(flattedAppsRoutes),
            []
        );

        return (
            <Switch>
                {routes.map(
                    ({
                        component: Component,
                        path,
                        exact,
                        rerenderOnPathChange,
                        permissions,
                        ...route
                    }) => {
                        return (
                            <ProtectedRoute
                                key={
                                    rerenderOnPathChange
                                        ? location.pathname
                                        : path
                                }
                                path={path}
                                exact={exact}
                                permissions={permissions}
                                component={(props: any) => (
                                    <Component
                                        {...props}
                                        {...(route.props || {})}
                                    />
                                )}
                            />
                        );
                    }
                )}
                <Redirect to={defaultPath} />
            </Switch>
        );
    },
    () => true
);
