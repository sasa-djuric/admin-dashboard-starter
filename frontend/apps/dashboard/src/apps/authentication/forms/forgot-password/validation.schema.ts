import * as yup from 'yup';

export default yup.object({
	email: yup.string().required().email().label('Email')
});
