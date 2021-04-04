import { Permissions } from '@app/services';
import { Fragment } from 'react';
import usePermissions from '../../hooks/use-permissions';

interface ProtectedProps {
    permissions: Array<Permissions>;
}

const Protected: React.FunctionComponent<ProtectedProps> = ({
    permissions,
    children,
}) => {
    const havePermission = usePermissions();

    if (!havePermission(permissions)) {
        return <Fragment />;
    }

    return <Fragment>{children}</Fragment>;
};

export default Protected;
