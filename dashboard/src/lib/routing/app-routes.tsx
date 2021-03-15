import React, { memo, useMemo } from 'react';
import { Switch, Redirect, Route, useLocation } from 'react-router';
import { App, BaseRoute, Route as RouteI } from 'src/interfaces';

interface RenderAppRoutesProps {
	apps: Array<App>;
	defaultPath?: string;
}

const mapRoutes = (app: App) => (route: BaseRoute) => ({
	...route,
	path: `${app.name ? '/' + app.name : ''}${route.path}`
});
const flattedAppsRoutes = (app: App) => app.routes.map(mapRoutes(app));

export const AppRoutes: React.FunctionComponent<RenderAppRoutesProps> = memo(
	({ apps, defaultPath = '/' }) => {
		const location = useLocation();
		const routes: Array<RouteI> = useMemo(() => apps.flatMap(flattedAppsRoutes), []);

		return (
			<Switch>
				{routes.map(({ component: Component, path, exact, rerenderOnPathChange, ...route }) => {
					return (
						<Route
							key={rerenderOnPathChange ? location.pathname : path}
							path={path}
							exact={exact}
							component={(props: any) => <Component {...props} {...(route.props || {})} />}
						/>
					);
				})}
				<Redirect to={defaultPath} />
			</Switch>
		);
	},
	() => true
);
