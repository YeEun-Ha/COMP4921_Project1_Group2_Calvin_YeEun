import HomePage from '../components/home';
import { createTables } from '../server/database/create_tables';
import { json, useLoaderData } from '@remix-run/react';

export const loader = async ({ context }) => {
    console.log('Create tables');
    await createTables();
    console.log(context);
    if (context?.session?.authenticated == null) {
        return json({ authenticated: false });
    }
    const authenticated = context.session?.authenticated;
    return json({ authenticated });
};

export default function Index() {
    const { authenticated } = useLoaderData();
    return <HomePage authenticated={authenticated} />;
}
