import * as yup from 'yup';

export default yup.object({
	name: yup.string().required().min(3).label('Name'),
	permissions: yup.array().min(1).label('Permissions')
});
