const postLogin = async () => {
  var username = req.body.username;
  var password = req.body.password;
  var results = await db_users.getUser({ user: username, hashedPassword: password });

  if (results) {
    if (results.length == 1) { //there should only be 1 user in the db that matches
      if (bcrypt.compareSync(password, results[0].password)) {
        req.session.authenticated = true;
        req.session.username = username;
        // req.session.user_type = results[0].type;
        req.session.cookie.maxAge = expireTime;
        res.redirect('/loggedIn');
        return;
      }
      else{
        console.log("invalid password");
      }
    } else {
      console.log('invalid number of users matched: '+results.length+" (expected 1).");
      res.redirect('/login?badlogin=1');
      return;            
    }
  }
  //user and password combination not found
  console.log('user not found');
  // res.redirect("/login?badlogin=1");
}

const postSubmitUser = async () => {
  var username = req.body.username;
  var password = req.body.password;
  var hashedPassword = bcrypt.hashSync(password, saltRounds);

  var success = await db_users.createUser({ user: username, hashedPassword: hashedPassword });
  if (success) {
    res.redirect('/');
  } else {
    var html = `
<h1 style='color:red'>Error!</h1>
<div>Failed to create user.</div>
`
    res.send(html);
    // res.render("errorMessage", {error: "Failed to create user."} );
  }
}
