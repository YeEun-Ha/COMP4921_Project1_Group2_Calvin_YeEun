import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';
import './tailwind.css';
import { MantineProvider, ColorSchemeScript, Flex } from '@mantine/core';
import '@mantine/core/styles.css';
import Navbar from './components/common/navbar';
import Footer from './components/common/footer';

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
    return (
        <MantineProvider>
            <Flex direction='column' style={{ minHeight: '100vh' }}>
                <Navbar />
                <div style={{ flexGrow: 1 }}>
                    <Outlet />{' '}
                </div>
            </Flex>
            <Footer />
        </MantineProvider>
    );
}
