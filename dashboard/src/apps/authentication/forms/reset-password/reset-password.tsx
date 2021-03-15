// Libs
import { Button, Form, Input, notification } from 'antd';
import { useFormik } from 'formik';
import { omit } from 'ramda';

// Asstes
import { LockOutlined } from '@ant-design/icons';

// Services
import authenticationService from '@startup/services/authentication';

// Config
import validationSchema from './validation.schema';

interface ResetPasswordProps {
	token: string;
	onSuccess: Function;
}

const ResetPasswordForm: React.FunctionComponent<ResetPasswordProps> = ({ token, onSuccess }) => {
	const { handleChange, handleSubmit, values, errors, isSubmitting } = useFormik({
		initialValues: {
			password: '',
			passwordRepeat: ''
		},
		validationSchema,
		validateOnChange: false,
		onSubmit: values => {
			return authenticationService
				.resetPassword({ ...omit(['passwordRepeat'], values), token })
				.then(result => {
					if (onSuccess) {
						onSuccess();
					}
				})
				.catch(err => {
					notification.error({
						message: err.message
					});
				});
		}
	});

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit} style={{ width: '380px' }} size='large'>
			<Form.Item validateStatus={errors.password ? 'error' : 'success'} help={errors.password}>
				<Input.Password
					type='password'
					name='password'
					placeholder='Password'
					prefix={<LockOutlined />}
					value={values.password}
					onChange={handleChange}
				/>
			</Form.Item>
			<Form.Item validateStatus={errors.passwordRepeat ? 'error' : 'success'} help={errors.passwordRepeat}>
				<Input.Password
					type='password'
					name='passwordRepeat'
					placeholder='Repeat password'
					prefix={<LockOutlined />}
					value={values.passwordRepeat}
					onChange={handleChange}
				/>
			</Form.Item>
			<Button htmlType='submit' type='primary' style={{ width: '100%' }} loading={isSubmitting}>
				Reset
			</Button>
		</Form>
	);
};

export default ResetPasswordForm;
