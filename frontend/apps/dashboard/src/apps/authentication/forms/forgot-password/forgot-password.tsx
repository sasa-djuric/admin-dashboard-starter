// Libs
import { Button, Form, Input, notification } from 'antd';
import { useFormik } from 'formik';

// Asstes
import { UserOutlined } from '@ant-design/icons';

// Services
import authenticationService, { ForgotPasswordRequest } from '@app/services/authentication';

// Config
import validationSchema from './validation.schema';

interface ForgotPasswordProps {
	onSuccess: Function;
}

const ForgotPasswordForm: React.FunctionComponent<ForgotPasswordProps> = ({ onSuccess }) => {
	const {
		handleChange,
		handleSubmit,
		values,
		errors,
		isSubmitting
	} = useFormik<ForgotPasswordRequest>({
		initialValues: {
			email: ''
		},
		validationSchema,
		validateOnChange: false,
		onSubmit: values => {
			return authenticationService
				.forgotPassword(values)
				.then(result => {
					if (onSuccess) {
						onSuccess();
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
			<Button
				htmlType='submit'
				type='primary'
				style={{ width: '100%' }}
				loading={isSubmitting}
			>
				Submit
			</Button>
		</Form>
	);
};

export default ForgotPasswordForm;
