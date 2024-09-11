
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import session from "express-session" 
import bcrypt from "bcrypt"
import MongoStore from "connect-mongo"
import dotenv from "dotenv"
import { router } from "./apiRoutes/apiRoutes.js"

dotenv.config()

const saltRounds = 12;

// const database = include('databaseConnection');
// const db_utils = include('database/db_utils');
// const db_users = include('database/users');
// const success = db_utils.printMySQLVersion();

const PORT = process.env.PORT
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


// app.use(session({ 
//   secret: node_session_secret,
//   store: MongoStore.create({
//     mongoUrl: `mongodb://${mongodb_user}:${mongodb_password}@localhost:27017/sessions`, // update with your actual MongoDB connection string
//     ttl: 14 * 24 * 60 * 60, // Sessions will expire after 14 days (in seconds)
//   }), //default is memory store 
//   saveUninitialized: false, 
//   resave: true    
// }
// ));
//
const build = viteDevServer
  ? () =>
      viteDevServer.ssrLoadModule(
        "virtual:remix/server-build"
      )
  : await import("./build/server/index.js");


app.use('/api', router())

app.post('/submitUser', async (req,res) => {
    var username = req.body.username;
    var password = req.body.password;
    var hashedPassword = bcrypt.hashSync(password, saltRounds);

    var success = await db_users.createUser({ user: username, hashedPassword: hashedPassword });
    if (success) {
        res.redirect('/');
    } else {
        res.status(404)
        res.json({success: false, message: "Error creating new user"});
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
