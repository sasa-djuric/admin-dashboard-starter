import { Button, Form, Input, notification } from 'antd';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';

// Asstes
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// Config
import validationSchema from './validation.schema';

// Services
import authenticationService, { LoginRequest } from '@app/services/authentication';

interface LoginFormProps {
	onSuccess?: Function;
}

const LoginForm: React.FunctionComponent<LoginFormProps> = ({ onSuccess }) => {
	const { handleChange, handleSubmit, values, errors, isSubmitting } = useFormik<LoginRequest>({
		initialValues: {
			email: '',
			password: ''
		},
		validationSchema,
		validateOnChange: false,
		onSubmit: values => {
			return authenticationService
				.login(values)
				.then(result => {
					if (onSuccess) {
						onSuccess(result);
					}
				})
				.catch(err => {
					notification.error({
						message: err.message
					});

					throw err;
				});
		}
	});

	return (
		<Form
			layout='vertical'
			onSubmitCapture={handleSubmit}
			style={{ width: '380px' }}
			size='large'
		>
			<Form.Item validateStatus={errors.email ? 'error' : 'success'} help={errors.email}>
				<Input
					type='email'
					name='email'
					placeholder='E-mail'
					prefix={<UserOutlined />}
					value={values.email}
					onChange={handleChange}
				/>
			</Form.Item>
			<Form.Item
				validateStatus={errors.password ? 'error' : 'success'}
				help={errors.password}
			>
				<Input.Password
					type='password'
					name='password'
					placeholder='Password'
					prefix={<LockOutlined />}
					value={values.password}
					onChange={handleChange}
				/>
			</Form.Item>

			<div
				style={{
					display: 'flex',
					marginBottom: '24px',
					justifyContent: 'center'
				}}
			>
				<Link to='/forgot-password' style={{ marginLeft: 'auto' }}>
					Forgot password?
				</Link>
			</div>

			<Button
				htmlType='submit'
				type='primary'
				style={{ width: '100%' }}
				loading={isSubmitting}
			>
				Login
			</Button>
		</Form>
	);
};

export default LoginForm;
