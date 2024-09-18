import { updateHit } from "../server/models/usersModel";
import { json } from '@remix-run/react';

export const action = async ({ request }) => {
    console.log("req.body is the following:", req.body);
    const shortUrl = req.body.shortUrl; 

    if (shortUrl != '') {
        var [hitsAndLasthit] = await updateHit('texts', shortUrl)
        
        json({
            success: true,
            hits: hitsAndLasthit[0].hits,
            lastHit: hitsAndLasthit[0].last_hit
        });
    } else {
        console.log("No url. Received one:", shortUrl)
    }
}
