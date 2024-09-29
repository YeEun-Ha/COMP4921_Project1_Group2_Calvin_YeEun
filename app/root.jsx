import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import './tailwind.css';
import { MantineProvider, ColorSchemeScript, Flex } from '@mantine/core';
import '@mantine/core/styles.css';
import Navbar from './components/common/navbar';
import Footer from './components/common/footer';

export const loader = async ({ request, context }) => {
    const { session, userId, authenticated } = context.session;

    return json({
        userId,
        authenticated,
        session,
    });
};

export function Layout({ children }) {
    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <Meta />
                <Links />
                <ColorSchemeScript />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const { userId, authenticated } = useLoaderData();
    console.log(authenticated);
    return (
        <MantineProvider>
            <Flex direction='column' style={{ minHeight: '100vh' }}>
                <Navbar authenticated={authenticated} />
                <div style={{ flexGrow: 1 }}>
                    <Outlet />{' '}
                </div>
            </Flex>
            <Footer />
        </MantineProvider>
    );
}
