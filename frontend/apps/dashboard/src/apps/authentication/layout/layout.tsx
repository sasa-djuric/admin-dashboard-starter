import styles from './layout.module.scss';

export interface LayoutProps {}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
	return <div className={styles['authentication-layout']}>{children}</div>;
};

export default Layout;
