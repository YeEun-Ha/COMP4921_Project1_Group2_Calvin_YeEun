import URLDashboard from '../components/url-dashboard';
import { useLoaderData } from '@remix-run/react';
import { getContentList } from '../server/controllers/dashbordController';
import { json } from '@remix-run/react';

export const loader = async () => {
    console.log('Start-- /dashboard - data loader');
    const data = await getContentList(); // Fetch the data from your database
    return json({ table: data }); // Return the data as a JSON response
    // return data
};

export default function URLDashboardPage() {
    const loaderData = useLoaderData();
    return <URLDashboard loaderData={loaderData}></URLDashboard>;
}
