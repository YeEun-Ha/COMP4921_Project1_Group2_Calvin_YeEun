import { generateUrlKey } from '../server/models/urlModel';
import { json } from '@remix-run/node';

export const action = async ({ request }) => {
    // console.log('request?', await request.json());

    try{
        const urlKey = await generateUrlKey();
        // console.log('received url key --> ', urlKey);
        return json ({
            success: true,
            generatedURL: urlKey
        });
    } catch(error) {
        console.error("Error receiving URL");
        // return json({ success: false, error: error.message });
    }
}