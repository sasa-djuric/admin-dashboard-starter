import * as yup from 'yup';

export default yup.object({
	name: yup.string().required().min(3).label('Name'),
	email: yup.string().required().email().label('Email'),
	roleId: yup.number().required().label('Role')
});
