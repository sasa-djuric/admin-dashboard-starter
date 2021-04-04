import styles from './page.module.scss';

export interface AuthenticationPageProps {}

const AuthenticationPage: React.FunctionComponent<AuthenticationPageProps> = ({
    children,
}) => {
    return <div className={styles['authentication-page']}>{children}</div>;
};

export default AuthenticationPage;
