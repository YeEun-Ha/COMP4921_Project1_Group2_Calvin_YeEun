import { useParams, useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
export default function URLContent() {
    const params = useParams();
    const fetcher = useFetcher();

    useEffect(() => {
        console.log(params);
        const url = params.url;

        fetcher.submit(
            formData, // Your form data
            { method: 'post', action: '/api/submitContent' } // The action route
        );
    }, [params]);

    return (
        <>
            <h1>test</h1>
        </>
    );
}
