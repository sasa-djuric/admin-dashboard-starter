// Libs
import { useFormik } from 'formik';
import { useQuery } from 'react-query-service';

// Components
import { Button, Col, Divider, Form, Input, Row, Select, Switch } from 'antd';
import ImageInput from '@components/image-input';

// Config
import validationSchema from './validation.schema';

// Services
import { ID } from '@startup/services';
import usersService, { User } from '@startup/services/users';

// Utils
import { isNil } from 'ramda';

interface CreateProps {
	id?: ID | null;
	isEditMode: boolean;
	onSubmit: (promise: Promise<any>) => void;
}

type CreateUserFormI = User;

const CreateUserForm: React.FunctionComponent<CreateProps> = ({ id, isEditMode, onSubmit }) => {
	const { data: user } = useQuery(usersService.queries.getById(id), { enabled: !isNil(id), suspense: true });
	const { handleChange, setFieldValue, handleSubmit, values, errors, isSubmitting } = useFormik<
		CreateUserFormI | Omit<CreateUserFormI, 'id'>
	>({
		initialValues: user || {
			name: '',
			email: '',
			isActive: true,
			permissions: [],
			profileImage: null
		},
		validationSchema,
		validateOnChange: false,
		onSubmit: values => {
			let promise: Promise<any> = Promise.resolve();

			if (!isEditMode) {
				promise = usersService.create(values);
			} else {
				promise = usersService.update(values);
			}

			if (onSubmit) {
				onSubmit(promise);
			}
		}
	});

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Row gutter={[36, 0]}>
				<Col style={{ marginLeft: 'auto' }}>
					<Form.Item label='Active' style={{ marginBottom: 0 }}>
						<Switch checked={values.isActive} onChange={is => setFieldValue('isActive', is)} />
					</Form.Item>
				</Col>
			</Row>

			<Divider />

			<Form.Item label='Name' required validateStatus={errors.name ? 'error' : 'success'} help={errors.name}>
				<Input name='name' placeholder='Input user name' value={values.name} onChange={handleChange} />
			</Form.Item>

			<Form.Item label='E-mail' required validateStatus={errors.email ? 'error' : 'success'} help={errors.email}>
				<Input name='email' placeholder='Input user email' value={values.email} onChange={handleChange} />
			</Form.Item>

			{/* <Form.Item
				label='User role'
				style={{ marginBottom: 0 }}
				validateStatus={errors.role ? 'error' : 'success'}
				help={errors.role}
			>
				<Select
					placeholder='Select user role'
					options={[]}
					value={values.role}
					onChange={e => {
						setFieldValue('role', e);
					}}
				/>
			</Form.Item> */}

			<Row gutter={[16, 24]} style={{ margin: '24px 0' }}>
				<Col span={8}>
					<Form.Item
						label='Profile image'
						required
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

			<Button htmlType='submit' type='primary' style={{ width: '100%' }} loading={isSubmitting}>
				Save
			</Button>
		</Form>
	);
};

export default CreateUserForm;
