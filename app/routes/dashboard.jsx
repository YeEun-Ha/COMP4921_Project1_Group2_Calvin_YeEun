import URLDashboard from '../components/url-dashboard';
import { useLoaderData } from '@remix-run/react';
import { getContent } from '../server/models/usersModel';
import { json } from '@remix-run/react';


// Server-side data fetching
export const loader = async() => {
    const data = await getContent();  // Fetch the data from your database
    console.log(data)
    return json({ table: data }); // Return the data as a JSON response
    // return data
}

export default function URLDashboardPage() {
    const loaderData = useLoaderData();
    return <URLDashboard loaderData={loaderData}></URLDashboard>;
}
