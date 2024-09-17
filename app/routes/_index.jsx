import HomePage from '../components/home';
import { createTables } from '../server/database/create_tables';

export const loader = async () => {
    console.log('Create tables');

    await createTables();

    return null;
};

export default function Index() {
    return <HomePage />;
}
