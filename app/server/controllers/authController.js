export const postLogin = async (req, res) => {
    // var username = req.body.username;
    // var password = req.body.password;
    // var hashedPassword = bcrypt.hashSync(password, saltRounds);
    //
    // var success = await db_users.createUser({ user: username, hashedPassword: hashedPassword });
    const success = false
    if (success) {
        res.redirect('/');
    } else {
        res.status(404)
        res.json({success: false, message: "Error creating new user"});
    }
}

