import db from '../database';

export const addContent = async (postData) => {
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
        console.log('successfully inserted new content');
        return true;
    } catch (err) {
        console.log(err);
        console.error('Error inserting url content');
        return false;
    }
};

export async function getContent() {
    let getData = `
        SELECT url_id, content, content_type, hits, active, created_at, last_hit 
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
		WHERE short_url = ?      
	`;
    let getData = `
		SELECT hits, last_hit FROM url 
		WHERE short_url = ?
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
