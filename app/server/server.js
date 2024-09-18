import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.SESSION_SECRET;

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

app.use(
    session({
        secret: node_session_secret,
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.dqd1fyd.mongodb.net/sessions`, // update with your actual MongoDB connection strin
            ttl: 14 * 24 * 60 * 60, // Sessions will expire after 14 days (in seconds)
            crypto: {
                secret: mongodb_session_secret,
            },
        }),
        saveUninitialized: false,
        resave: false,
    })
);

const build = viteDevServer
    ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
    : await import('./build/server/index.js');

app.all(
    '*',
    createRequestHandler({
        getLoadContext(req) {
            return { session: req.session };
        },
        build: build,
    })
);

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});
