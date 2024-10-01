import HomePage from '../components/home';
import { createTables } from '../server/database/create_tables';
import { json, useLoaderData } from '@remix-run/react';

export const loader = async ({ context }) => {
    const authenticated = context.session?.authenticated;
    console.log('Create tables');
    await createTables();

    return json({ authenticated });
};

export default function Index() {
    const { authenticated } = useLoaderData();
    return <HomePage authenticated={authenticated} />;
}
