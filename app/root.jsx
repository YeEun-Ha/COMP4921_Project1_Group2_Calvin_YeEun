import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';
import './tailwind.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import Navbar from './components/common/navbar';

export function Layout({ children }) {
    return (
        <html lang='en' data-mantine-color-scheme='light'>
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
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Layout>
                <Navbar />
                <Outlet />
            </Layout>
        </MantineProvider>
    );
}
