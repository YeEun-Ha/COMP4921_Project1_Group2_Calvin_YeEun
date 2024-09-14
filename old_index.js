require('./utils');
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const saltRounds = 12;

const database = include('databaseConnection');
const db_utils = include('database/db_utils');
const db_users = include('database/users');
const success = db_utils.printMySQLVersion();

const port = process.env.PORT || 3030;
const app = express();

const expireTime = 1 * 60 * 60 * 1000; //expires after 1 hour  (hours * minutes * seconds * millis)

const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = "aab2475b-ad13-4d28-9363-9d3c6f11cc91";

// app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

var mongoStore = MongoStore.create({
	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.dqd1fyd.mongodb.net/sessions`,
	crypto: {
		secret: mongodb_session_secret
	}
})

app.use(session({ 
    secret: node_session_secret,
	store: mongoStore, //default is memory store 
	saveUninitialized: false, 
	resave: true    
}
));

// app.use('/', sessionValidation);

app.get('/', (req,res) => {
    // if (req.session.username) {
    //     var html = `<h1>Hello, ${req.session.username}!</h1>`
    //     res.send(html);
    //     // res.render("loggedin", {username: req.session.username});
    // } else{
        // var loginFail = req.query.badlogin;
        var html = `
        <form action='/loggingin' method='post'>
        <input name='username' type='text' placeholder='username'>
        <input name='password' type='password' placeholder='password'>
        <button style="">Login</button>
        </form>
        <button style=""><a href="http://localhost:3030/signup">Signup</a>
        </button>
        `;
        res.send(html);
        // res.render("login", {failedLogin: loginFail});
    // }
});

app.get('/createTables', async (req,res) => {   // To Test: Go to http://localhost:port/createTables
    const create_tables = include('database/create_tables');
    var success = create_tables.createTables();
    if (success) {
        res.send("<h1>Success! Created tables.</h1>");
        // res.render("successMessage", {message: "Created tables."} );
    }
    else {
        res.send("h1 style='color:red'>Error!</h1> <div>Failed to create tables. </div>");
        // res.render("errorMessage", {error: "Failed to create tables."} );
    }
});

app.get('/signup', (req,res) => {
    // var missingUsername = req.query.missingName;
    // var missingPassword = req.query.missingPass;
    // var missingBoth = req.query.missingBoth;

    var html = `
    <h1>create user!!</h1>
    <form action='/submitUser' method='post'>
    <input name='username' type='text' placeholder='username'><br>
    <input name='password' type='password' placeholder='password'><br>
    <button>Submit</button>
    </form>
    `;
    res.send(html);
    // res.render("createUser", {missingName: missingUsername, missingPass: missingPassword, missingBoth: missingBoth});
}); 

app.post('/submitUser', async (req,res) => {
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
});

app.post('/loggingin', async (req,res) => {
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
});

// app.use('/loggedin', sessionValidation);
// app.use('/loggedin/admin', adminAuthorization);

app.get('/loggedin', (req,res) => {
    var html = `<h1>Hello, ${req.session.username}!</h1>`
    res.send(html);
    // res.render("loggedin", {username: req.session.username});
});


app.get('/mainDisplay', (req, res) => {
    var html = ` Filter: 
    <button>links</button>
    <button>Images</button>
    <button>Text</button>
    <button>Create a new posting</button>
    <table>
        <tr>
            <th>TEXT</th>
            <th>Short URL</th>
            <th>Hits</th>
            <th>Active</th>
            <th>Created</th>
            <th>Last Hit</th>
        </tr>
        <tr>
            <td></td>
        </tr>
    </table>`
    res.send(html);
})



app.use(express.static(__dirname + "/public"));

app.get("*", (req,res) => {
	res.status(404);
    res.send("Page not found - 404 :D");
	// res.render("404");
})

app.listen(port, () => {
	console.log("Node application listening on port "+port);
}); 
