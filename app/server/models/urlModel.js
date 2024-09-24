import db from '../database';

export const addContent = async (postData) => {
    console.log(`postData --->`, postData);

    const addContentSQL = `INSERT INTO url (url_id, content, content_type_id, hits, active, created_at, last_hit, user_id) 
VALUES(:urlId, :content, :contentType, :hits, :active, :created_at, :last_hit, 1)`;

    const params = {
        urlId: postData.urlId,
        content: postData.content,
        contentType: postData.contentType,
        hits: 0,
        active: true,
        created_at: postData.createdAt,
        last_hit: postData.createdAt,
    };
    try {
        const result = await db.query(addContentSQL, params);
        console.log('successfully inserted new content to db');
        return true;
    } catch (err) {
        console.log(err);
        console.error('Error inserting url content to db');
        return false;
    }
};

export async function getContent() {
    let getData = `
        SELECT url_id, content, content_type_id, hits, active, created_at, last_hit, user_id
        FROM url;
        `;
    try {
        const results = await db.query(getData);
        return results;
    } catch (err) {
        console.error('Error fetching data from MySQL:', err);
    }
}

export async function updateHit(shortUrl) {
    let updateData = `
		UPDATE url
		SET hits = hits + 1, last_hit = NOW() 
		WHERE url_id = ?      
	`;
    let getData = `
		SELECT hits, last_hit FROM url 
		WHERE url_id = ?
	`;
    try {
        await db.query(updateData, [shortUrl]);
        const results = await db.query(getData, [shortUrl]);

        console.log(`Successfully updated the hit:`, results);
        return results;
    } catch (error) {
        console.error(`Error updating hits:`, error);
        // res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export const generateUrlKey = async () => {
    //ddd
    const [dbRows] = await db.query('SELECT generate_url_friendly_pk() AS url_key;');
    console.log('successfully created an url:', dbRows);
    return dbRows[0].url_key;
}
