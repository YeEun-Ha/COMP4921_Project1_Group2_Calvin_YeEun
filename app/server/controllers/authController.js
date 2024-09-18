import bcrypt from 'bcrypt';

export const postLogin = async (userPayload) => {
    const username = userPayload.username;
    const password = userPayload.password;

    const user = await getUsers({ username, password: hashedPassword });

    if (!user) {
        return false;
    }

    if (user.length != 1) {
        return false;
    }

    const hashedPassword = user[0].hashedPassword;

    if (bcrypt.compareSync(password, hashedPassword)) {
        console.log(hashedPassword);
        //add session data here
        return true;
    }

    return false;
};
