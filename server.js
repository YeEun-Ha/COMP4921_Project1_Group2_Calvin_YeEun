import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT;

const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.SESSION_SECRET;

async function startServer() {
    // const viteDevServer =
    //     process.env.NODE_ENV === 'production'
    //         ? null
    //         : await import('vite').then((vite) =>
    //               vite.createServer({
    //                   server: { middlewareMode: true },
    //               })
    //           );
    //
    const viteDevServer = null;
    console.log(
        'Vite Dev Server:',
        viteDevServer ? 'Running in dev mode' : 'Production mode'
    );

    const app = express();

    app.set('trust proxy', 1); // Trust the first proxy
    app.use(
        cors({
            origin: 'https://comp4921-project1-group2-calvin-yeeun.onrender.com',
            credentials: true, // Allow cookies to be sent
        })
    );

    // Use Vite's middleware in development, otherwise serve static files in production
    app.use(
        viteDevServer
            ? viteDevServer.middlewares
            : express.static('build/client')
    );

    // Log before session middleware
    app.use((req, res, next) => {
        console.log('Before session middleware:', req.url);
        next();
    });

    // Set up MongoStore once and use it
    const mongoStore = MongoStore.create({
        mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.dqd1fyd.mongodb.net/sessions`, // your MongoDB connection string
        ttl: 14 * 24 * 60 * 60, // Sessions will expire after 14 days (in seconds)
        crypto: {
            secret: mongodb_session_secret,
        },
    });

    mongoStore.on('connected', () => {
        console.log('MongoStore connected');
    });

    mongoStore.on('error', (error) => {
        console.error('MongoStore connection error:', error);
    });

    // Set up session middleware
    app.use(
        session({
            secret: node_session_secret,
            store: mongoStore, // Use the same mongoStore instance
            saveUninitialized: false,
            resave: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production', // set secure cookies in production
                sameSite: 'lax', // or 'strict' depending on your needs
            },
        })
    );

    // Log after session middleware
    app.use((req, res, next) => {
        console.log('After session middleware:', req.session);
        next();
    });

    // Handle remix build either in dev or production
    const build = viteDevServer
        ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
        : await import('./build/server/index.js');

    // Remix request handler
    app.all(
        '*',
        createRequestHandler({
            getLoadContext(req) {
                console.log('Session in production:', req.session);
                return { session: req.session };
            },
            build: build,
        })
    );
    app.listen(PORT, () => {
        console.log(`App listening on http://localhost:${PORT}`);
    });
}

// Start the server
startServer().catch((err) => {
    console.error('Error starting server:', err);
});
