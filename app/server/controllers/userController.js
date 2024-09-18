import bcrypt from 'bcrypt';
import { createUser } from '../models/usersModel.js';
import { SALT_ROUNDS } from '../utils/constants.js';

export const signUpUser = async ({ username, password }) => {
    const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    const result = await createUser({
        username: username,
        password: hashPassword,
    });

    if (!result) {
        throw new Error('Error signing up new user');
    }
    return { success: true };
};
