import db from '../database';

export const addContent = async (postData) => {
    const addContentSQL = `
    INSERT INTO url 
    (url_id, user_id, content, content_type_id, hits, active, created_at, last_hit) VALUES (
        check_and_generate_hash(:urlId), 
        :userId, 
        :content, 
        :contentTypeId, 
        :hits, 
        :active, 
        :created_at, 
        :last_hit
    )`;
    const params = {
        urlId: postData.urlId,
        userId: postData.userId,
        content: postData.content,
        contentTypeId: postData.contentTypeId,
        hits: 0,
        active: true,
        created_at: postData.createdAt,
        last_hit: postData.createdAt,
    };
    try {
        const result = await db.query(addContentSQL, params);
        console.log(result);
        console.log('successfully inserted new content to db');
        return true;
    } catch (err) {
        console.log(err);
        console.error('Error inserting url content to db');
        return false;
    }
};

export async function getUrlContents() {
    let getData = `
    SELECT u.url_id, 
           c.content_id AS content_type_id, 
           u.content,
           u.hits, 
           u.active, 
           u.created_at, 
           u.last_hit, 
           u.user_id
    FROM url u
    JOIN content_type c 
      ON u.content_type_id = c.content_id
    ORDER BY u.created_at DESC;
        `;
    try {
        const results = await db.query(getData);
        return results;
    } catch (err) {
        console.error('Error fetching data from MySQL:', err);
    }
}

export async function getUrlContent(urlID) {
    const urlContent = `
SELECT * FROM url WHERE url_id = :urlID
`;
    const params = {
        urlID: urlID,
    };
    try {
        const result = await db.query(urlContent, params);
        return result[0][0];
    } catch (err) {
        console.error('Error fetching url content from SQL');
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
