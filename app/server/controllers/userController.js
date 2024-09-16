import bcrypt from 'bcrypt';
import { createUser } from '../models/usersModel.js';

const saltRounds = 12;

export const signUpUser = async ({ username, password }) => {
    const hashPassword = bcrypt.hashSync(password, saltRounds);

    const result = await createUser({
        username: username,
        password: hashPassword,
    });

    if (!result) {
        throw new Error('Error signing up new user');
    }
    return { success: true };
};
