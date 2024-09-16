import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

dotenv.config();

const saltRounds = 12;

// const database = include('databaseConnection');
// const db_utils = include('database/db_utils');
// const db_users = include('database/users');
// const success = db_utils.printMySQLVersion();

const PORT = process.env.PORT;
const expireTime = 1 * 60 * 60 * 1000; //expires after 1 hour  (hours * minutes * seconds * millis)

const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env_SESSION_SECRET;

const viteDevServer =
    process.env.NODE_ENV === 'production'
        ? null
        : await import('vite').then((vite) =>
              vite.createServer({
                  server: { middlewareMode: true },
              })
          );

const app = express();

app.use(
    viteDevServer ? viteDevServer.middlewares : express.static('build/client')
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
    ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
    : await import('./build/server/index.js');

app.all('*', createRequestHandler({ build }));

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});
