import { updateHit } from "../server/models/usersModel";
import { json } from '@remix-run/react';

export const action = async ({ request }) => {
    const parsedJson = await request.json();
    console.log("result of parsing the JSON body" , parsedJson);
    
    const shortUrl = parsedJson.shortUrl; 

    if (shortUrl != '') {
        var [hitsAndLasthit] = await updateHit('texts', shortUrl)
        
        return json({
            success: true,
            hits: hitsAndLasthit[0].hits,
            lastHit: hitsAndLasthit[0].last_hit
        });
    } else {
        console.log("No url. Received one:", shortUrl)
    }
}
