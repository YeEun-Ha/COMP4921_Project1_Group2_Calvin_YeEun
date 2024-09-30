import bcrypt from 'bcryptjs';
import { createUser } from '../models/usersModel.js';
import { SALT_ROUNDS } from '../utils/constants.js';
import { signUpValidator } from '../utils/validators.js';

export const signUpUser = async (data) => {
    const { username, password } = data;

    try {
        await signUpValidator.validate(data, {
            abortEarly: false,
        });

        const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);

        const result = await createUser({
            username: username,
            password: hashPassword,
        });

        if (!result) {
            return { success: false, errors: ['Error occurred signing up'] };
        }

        return { success: true, message: 'successfully signed up!' };
    } catch (err) {
        return { success: false, errors: err.errors };
    }
};
