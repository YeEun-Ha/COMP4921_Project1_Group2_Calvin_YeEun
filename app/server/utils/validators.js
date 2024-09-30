import * as Yup from 'yup';

export const signUpValidator = Yup.object().shape({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(/\d/, 'Password must contain at least one number'), // Enforce at least one number
});
