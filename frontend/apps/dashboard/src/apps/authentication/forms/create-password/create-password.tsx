// Libs
import { Button, Form, Input, notification } from 'antd';
import { useFormik } from 'formik';
import { omit } from 'ramda';

// Asstes
import { LockOutlined } from '@ant-design/icons';

// Services
import authenticationService, { ResetPasswordRequest } from '@app/services/authentication';

// Config
import validationSchema from './validation.schema';

interface ResetPasswordProps {
	type: 'activation' | 'reset';
	token: string;
	onSuccess: Function;
}

interface CreatePasswordFormI extends ResetPasswordRequest {
	passwordRepeat: string;
}

const CreatePasswordForm: React.FunctionComponent<ResetPasswordProps> = ({
	type,
	token,
	onSuccess
}) => {
	const {
		handleChange,
		handleSubmit,
		values,
		errors,
		isSubmitting
	} = useFormik<CreatePasswordFormI>({
		initialValues: {
			password: '',
			passwordRepeat: '',
			token
		},
		validationSchema,
		validateOnChange: false,
		onSubmit: values => {
			const requests = {
				reset: authenticationService.resetPassword,
				activation: authenticationService.activation
			};
			const requestMethod = requests[type];

			return requestMethod({ ...omit(['passwordRepeat'], values), token }).then(
				result => {
					if (onSuccess) {
						onSuccess();
					}
				},
				err => {
					notification.error({
						message: err.message
					});

					throw err;
				}
			);
		}
	});

	return (
		<Form
			layout='vertical'
			onSubmitCapture={handleSubmit}
			style={{ width: '380px' }}
			size='large'
		>
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
			<Form.Item
				validateStatus={errors.passwordRepeat ? 'error' : 'success'}
				help={errors.passwordRepeat}
			>
				<Input.Password
					type='password'
					name='passwordRepeat'
					placeholder='Repeat password'
					prefix={<LockOutlined />}
					value={values.passwordRepeat}
					onChange={handleChange}
				/>
			</Form.Item>
			<Button
				htmlType='submit'
				type='primary'
				style={{ width: '100%' }}
				loading={isSubmitting}
			>
				Reset
			</Button>
		</Form>
	);
};

export default CreatePasswordForm;
