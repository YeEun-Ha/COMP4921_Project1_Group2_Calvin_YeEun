import { createRequestHandler } from "@remix-run/express";
import express from "express";
import * as session from "express-session" 
import * as bcrypt from "bcrypt"
import * as MongoStore from "connect-mongo"

const saltRounds = 12;

const database = include('databaseConnection');
const db_utils = include('database/db_utils');
const db_users = include('database/users');
const success = db_utils.printMySQLVersion();

const PORT = process.env.PORT || 3030;

const expireTime = 1 * 60 * 60 * 1000; //expires after 1 hour  (hours * minutes * seconds * millis)

const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env_SESSION_SECRET;

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? null
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );



const app = express();
app.use(
  viteDevServer
    ? viteDevServer.middlewares
    : express.static("build/client")
);


app.use(session({ 
    secret: node_session_secret,
	store: mongoStore, //default is memory store 
	saveUninitialized: false, 
	resave: true    
}
));

const build = viteDevServer
  ? () =>
      viteDevServer.ssrLoadModule(
        "virtual:remix/server-build"
      )
  : await import("./build/server/index.js");


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

app.post('/login', async (req,res) => {
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

app.all("*", createRequestHandler({ build }));

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
