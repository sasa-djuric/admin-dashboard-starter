import * as yup from 'yup';

export default yup.object({
	email: yup.string().required().email().label('Email'),
	password: yup.string().required().min(6).label('Password'),
	passwordRepeat: yup
		.string()
		.required()
		.oneOf([yup.ref('password')], 'Two passwords must match')
		.label('Password repeat')
});
