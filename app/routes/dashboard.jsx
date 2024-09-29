import URLDashboard from '../components/url-dashboard';
import { useLoaderData } from '@remix-run/react';
import { getContentList } from '../server/controllers/dashbordController';
import { json } from '@remix-run/react';

export const loader = async ({ request, context }) => {
    const authenticated = context.session.authenticated;
    const userId = authenticated ? context.session.userId : null;

    const data = await getContentList(); // Fetch the data from your database

    return json({ userId: userId, table: data }); // Return the data as a JSON response
};

export default function URLDashboardPage() {
    const loaderData = useLoaderData();
    return <URLDashboard loaderData={loaderData}></URLDashboard>;
}
