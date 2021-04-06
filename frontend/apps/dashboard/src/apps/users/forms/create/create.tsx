// Libs
import { useFormik } from 'formik';
import { useQuery } from 'react-query-service';

// Components
import { Button, Col, Divider, Form, Input, notification, Row, Select, Switch } from 'antd';
import ImageInput from '../../../../components/image-input';

// Config
import validationSchema from './validation.schema';

// Services
import { ID } from '@app/services';
import usersService, { User } from '@app/services/users';
import rolesService from '@app/services/roles';

// Utils
import { isNil } from 'ramda';

interface CreateProps {
	id?: ID | null;
	isEditMode: boolean;
	onSubmit: (promise: Promise<User>) => void;
}

interface CreateUserFormI extends Omit<User, 'permissions'> {}

const CreateUserForm: React.FunctionComponent<CreateProps> = ({ id, isEditMode, onSubmit }) => {
	const { data: user } = useQuery(usersService.queries.getById(id), {
		enabled: !isNil(id),
		suspense: true
	});
	const { data: roles } = useQuery(rolesService.queries.getAll(), {
		suspense: true
	});
	const {
		handleChange,
		setFieldValue,
		handleSubmit,
		values,
		errors,
		dirty,
		isSubmitting
	} = useFormik<CreateUserFormI | Omit<CreateUserFormI, 'id'>>({
		initialValues: user || {
			name: '',
			email: '',
			isActive: true,
			roleId: '',
			profileImage: null
		},
		validationSchema,
		validateOnChange: false,
		onSubmit: values => {
			const requestMethodName = !isEditMode ? 'create' : 'update';
			const requestMethod = usersService[requestMethodName];
			let promise: Promise<User>;

			promise = requestMethod(values).then(
				result => {
					return result;
				},
				err => {
					notification.error({
						message: err.message
					});

					throw err;
				}
			);

			if (onSubmit) {
				onSubmit(promise);
			}

			return promise;
		}
	});

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			{isEditMode && (
				<Row gutter={[36, 0]}>
					<Col style={{ marginLeft: 'auto' }}>
						<Form.Item label='Active' style={{ marginBottom: '0px' }}>
							<Switch
								checked={values.isActive}
								onChange={is => setFieldValue('isActive', is)}
							/>
						</Form.Item>
					</Col>
				</Row>
			)}

			<Divider />

			<Form.Item
				label='Name'
				required
				validateStatus={errors.name ? 'error' : 'success'}
				help={errors.name}
			>
				<Input
					name='name'
					placeholder='Input user name'
					value={values.name}
					onChange={handleChange}
				/>
			</Form.Item>

			<Form.Item
				label='E-mail'
				required
				validateStatus={errors.email ? 'error' : 'success'}
				help={errors.email}
			>
				<Input
					name='email'
					placeholder='Input user email'
					value={values.email}
					onChange={handleChange}
				/>
			</Form.Item>

			<Form.Item
				label='User role'
				validateStatus={errors.roleId ? 'error' : 'success'}
				help={errors.roleId}
			>
				<Select
					placeholder='Select user role'
					options={roles?.map(role => ({
						label: role.name,
						value: role.id
					}))}
					value={values.roleId || undefined}
					onChange={e => {
						setFieldValue('roleId', e);
					}}
				/>
			</Form.Item>

			<Row gutter={[16, 24]} style={{ margin: '24px 0px' }}>
				<Col span={8}>
					<Form.Item
						label='Profile image'
						validateStatus={errors.profileImage ? 'error' : 'success'}
						help={errors.profileImage}
					>
						<ImageInput
							image={values.profileImage}
							onChange={profileImage => setFieldValue('profileImage', profileImage)}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Divider />

			<Button
				htmlType='submit'
				type='primary'
				style={{ width: '100%' }}
				loading={isSubmitting}
				disabled={!dirty}
			>
				Save
			</Button>
		</Form>
	);
};

export default CreateUserForm;
