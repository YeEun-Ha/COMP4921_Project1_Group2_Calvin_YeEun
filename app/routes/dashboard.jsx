import URLDashboard from '../components/url-dashboard';
import { useLoaderData } from '@remix-run/react';
import { getContent } from '../server/models/urlModel';
import { json } from '@remix-run/react';

export const loader = async () => {
    console.log('SSS');
    const data = await getContent(); // Fetch the data from your database
    return json({ table: data }); // Return the data as a JSON response
    // return data
};

export default function URLDashboardPage() {
    const loaderData = useLoaderData();
    return <URLDashboard loaderData={loaderData}></URLDashboard>;
}
