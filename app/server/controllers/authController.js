import bcrypt from 'bcryptjs';
import { getUser } from '../models/usersModel';
import { SALT_ROUNDS, COOKIE_EXPIRE } from '../utils/constants';

export const postLogin = async (userPayload) => {
    const username = userPayload.username;
    const password = userPayload.password;

    // const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
    const user = await getUser({ username });

    if (!user) {
        return {
            success: false,
            message: `The user ${username} does not exist`,
        };
    }

    if (user.length != 1) {
        return {
            success: false,
            message: `The user ${username} does not exist`,
        };
    }

    const hashedPassword = user[0].password;

    if (bcrypt.compareSync(password, hashedPassword)) {
        return {
            success: true,
            userID: user[0].user_id,
            username: user[0]?.username,
            expiry: COOKIE_EXPIRE,
        };
    }

    return {
        success: false,
        message: `Invalid username and/or pasword combination`,
    };
};
