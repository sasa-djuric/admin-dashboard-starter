// Libs
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useQuery } from 'react-query-service';

// Components
import {
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    notification,
    Row,
    Switch,
} from 'antd';

// Config
import validationSchema from './validation.schema';

// Services
import { ID, Permissions } from '@app/services';
import rolesService, { Role } from '@app/services/roles';

// Utils
import { isNil } from 'ramda';
import { uniq } from 'ramda';

interface CreateProps {
    id?: ID | null;
    isEditMode: boolean;
    onSubmit: (promise: Promise<Role>) => void;
}

const entities = [
    { label: 'Users', value: 'users' },
    { label: 'Roles', value: 'roles' },
];

const permissions = [
    { label: 'Create', value: 'create' },
    { label: 'Read', value: 'read' },
    { label: 'Update', value: 'update' },
    { label: 'Delete', value: 'delete' },
];

type CreateUserFormI = Role;

const CreateRoleForm: React.FunctionComponent<CreateProps> = ({
    id,
    isEditMode,
    onSubmit,
}) => {
    const { data: user } = useQuery(rolesService.queries.getById(id), {
        enabled: !isNil(id),
        suspense: true,
    });
    const [globalPermissions, setGlobalPermissions] = useState<Array<string>>(
        []
    );
    const {
        handleChange,
        setFieldValue,
        handleSubmit,
        values,
        errors,
        dirty,
        isSubmitting,
    } = useFormik<CreateUserFormI | Omit<CreateUserFormI, 'id'>>({
        initialValues: user || {
            name: '',
            isActive: true,
            permissions: [],
        },
        validationSchema,
        validateOnChange: false,
        onSubmit: (values) => {
            const requestMethodName = !isEditMode ? 'create' : 'update';
            const requestMethod = rolesService[requestMethodName];
            let promise: Promise<Role>;

            promise = requestMethod(values).then(
                (result) => {
                    return result;
                },
                (err) => {
                    notification.error({
                        message: err.message,
                    });

                    return err;
                }
            );

            if (onSubmit) {
                onSubmit(promise);
            }

            return promise;
        },
    });

    function onGlobalPermissionChange(permission: string) {
        const globalPermissions = entities.map(
            (entity) => `${entity.value}:${permission}`
        );
        const isAlreadyChecked = values.permissions.length
            ? globalPermissions.every((permission) =>
                  values.permissions.includes(permission as Permissions)
              )
            : false;

        if (isAlreadyChecked) {
            const currentPermissions = values.permissions.filter(
                (permission) => !globalPermissions.includes(permission)
            );

            setGlobalPermissions((permissions) =>
                permissions.filter(
                    (globalPermission) => globalPermission !== permission
                )
            );
            return setFieldValue('permissions', currentPermissions);
        }

        setGlobalPermissions((permissions) => [...permissions, permission]);
        setFieldValue(
            'permissions',
            uniq([...values.permissions, ...globalPermissions])
        );
    }

    function onPermissionChange(entity: string, permission: string) {
        const globalPermissions = entities.map(
            (entity) => `${entity.value}:${permission}`
        );
        const permissionValue = `${entity}:${permission}` as Permissions;
        const isAlreadyChecked =
            values.permissions.indexOf(permissionValue) >= 0;
        let currentPermissions: Array<string>;

        if (isAlreadyChecked) {
            currentPermissions = values.permissions.filter(
                (permission) => permission !== permissionValue
            );
        } else {
            currentPermissions = [...values.permissions, permissionValue];
        }

        const isGlobalChecked = currentPermissions.length
            ? globalPermissions.every((permission) =>
                  currentPermissions.includes(permission)
              )
            : false;

        setGlobalPermissions((permissions) =>
            isGlobalChecked
                ? [...permissions, permission]
                : permissions.filter(
                      (globalPermission) => globalPermission !== permission
                  )
        );

        setFieldValue('permissions', currentPermissions);
    }

    function updateGlobalPermissions(currentPermissions: Array<string>) {
        const globalPermissions: {
            [permission: string]: Array<Permissions>;
        } = {};

        entities.forEach((entity) => {
            permissions.forEach((permission) => {
                if (!globalPermissions[permission.value]) {
                    globalPermissions[permission.value] = [];
                }

                globalPermissions[permission.value].push(
                    `${entity.value}:${permission.value}` as Permissions
                );
            });
        });

        Object.entries(globalPermissions).forEach(
            ([permission, mappedPermissions]: [string, Array<Permissions>]) => {
                if (
                    mappedPermissions.every((globalPermission) =>
                        currentPermissions.includes(globalPermission)
                    )
                ) {
                    setGlobalPermissions((permissions) => [
                        ...permissions,
                        permission,
                    ]);
                }
            }
        );
    }

    useEffect(() => {
        if (user) {
            updateGlobalPermissions(user.permissions);
        }
    }, [user]);

    return (
        <Form layout="vertical" onSubmitCapture={handleSubmit}>
            <Row gutter={[36, 0]}>
                <Col style={{ marginLeft: 'auto' }}>
                    <Form.Item label="Active" style={{ marginBottom: 0 }}>
                        <Switch
                            checked={values.isActive}
                            onChange={(is) => setFieldValue('isActive', is)}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider />

            <Form.Item
                label="Name"
                required
                validateStatus={errors.name ? 'error' : 'success'}
                help={errors.name}
            >
                <Input
                    name="name"
                    placeholder="Input user name"
                    value={values.name}
                    onChange={handleChange}
                />
            </Form.Item>

            <Form.Item
                label="Permissions"
                required
                validateStatus={errors.permissions ? 'error' : 'success'}
                help={errors.permissions}
            >
                <Card title={'Global'} size="small">
                    <Row style={{ padding: '6px 16px' }}>
                        {permissions.map((permission) => {
                            return (
                                <Col span={24 / 4}>
                                    <Checkbox
                                        checked={globalPermissions.includes(
                                            permission.value
                                        )}
                                        onChange={(e) =>
                                            onGlobalPermissionChange(
                                                permission.value
                                            )
                                        }
                                    >
                                        {permission.label}
                                    </Checkbox>
                                </Col>
                            );
                        })}
                    </Row>
                </Card>

                {entities.map((entity) => {
                    return (
                        <Card title={entity.label} size="small">
                            <Row style={{ padding: '6px 16px' }}>
                                {permissions.map((permission) => {
                                    const currentPermission = `${entity.value}:${permission.value}`;
                                    const isChecked = !!values.permissions.find(
                                        (checkedPermission) =>
                                            checkedPermission ===
                                            currentPermission
                                    );
                                    return (
                                        <Col span={24 / 4}>
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={(e) =>
                                                    onPermissionChange(
                                                        entity.value,
                                                        permission.value
                                                    )
                                                }
                                            >
                                                {permission.label}
                                            </Checkbox>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Card>
                    );
                })}
            </Form.Item>

            <Divider />

            <Button
                htmlType="submit"
                type="primary"
                style={{ width: '100%' }}
                loading={isSubmitting}
                disabled={!dirty}
            >
                Save
            </Button>
        </Form>
    );
};

export default CreateRoleForm;
