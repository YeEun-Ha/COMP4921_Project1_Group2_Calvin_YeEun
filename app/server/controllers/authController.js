import bcrypt from 'bcrypt';
import { getUser } from '../models/usersModel';
import { SALT_ROUNDS, COOKIE_EXPIRE } from '../utils/constants';

export const postLogin = async (userPayload) => {
    const username = userPayload.username;
    const password = userPayload.password;

    // const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
    const user = await getUser({ username });
    console.log(user);

    if (!user) {
        return false;
    }

    if (user.length != 1) {
        return false;
    }

    const hashedPassword = user[0].password;

    if (bcrypt.compareSync(password, hashedPassword)) {
        return {
            userID: user[0].user_id,
            username: user[0]?.username,
            expiry: COOKIE_EXPIRE,
        };
    }

    return false;
};
