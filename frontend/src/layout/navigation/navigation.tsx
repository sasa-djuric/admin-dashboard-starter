import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { usePermissions } from '@apps/authentication';
import navigation, { NavigationConfig } from '@config/navigation';

interface NavigationProps {}

export const Navigation: React.FunctionComponent<NavigationProps> = () => {
	const havePermission = usePermissions();

	function findSelectedIndex(list: NavigationConfig, index?: number): Array<number> {
		const haveIndex = typeof index === 'number' && !Number.isNaN(index);

		for (let i = 0; i < list.length; i++) {
			if (list[i].children) {
				const subIndexes = findSelectedIndex(list[i].children!, i);
				return [
					...subIndexes.slice(0, subIndexes.length - 1),
					(haveIndex ? index! : 1) * subIndexes[subIndexes.length - 1]
				];
			} else if (
				list[i].path!.length > 1 &&
				window.location.pathname.includes(list[i].path!)
			) {
				return [index!, i + 1];
			}
		}

		return [0];
	}

	const selectedIndex = useMemo(() => findSelectedIndex(navigation), []);

	return (
		<Menu
			theme='dark'
			defaultSelectedKeys={[`main-menu-${selectedIndex[selectedIndex.length - 1]}`]}
			defaultOpenKeys={selectedIndex.map(index => `main-menu-${index}`)}
			mode='inline'
		>
			{navigation.map(({ title, icon, path, children: subItems, permissions }, index) => {
				if (!havePermission(permissions)) {
					return <Fragment />;
				}

				if (!subItems) {
					return (
						<Menu.Item key={`main-menu-${index}`} icon={icon}>
							<Link to={path!}>{title}</Link>
						</Menu.Item>
					);
				}

				return (
					<Menu.SubMenu key={`main-menu-${index}`} icon={icon} title={title}>
						{subItems.map(({ title, icon, path, permissions }, subIndex) => {
							if (!havePermission(permissions)) {
								return <Fragment />;
							}

							return (
								<Menu.Item
									key={`main-menu-sub-${(subIndex + 1) * index}`}
									icon={icon}
									title={title}
								>
									<Link to={path!}>{title}</Link>
								</Menu.Item>
							);
						})}
					</Menu.SubMenu>
				);
			})}
		</Menu>
	);
};
