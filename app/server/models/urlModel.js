import db from '../database';

export const addContent = async (postData) => {
    const addContentSQL = `INSERT INTO url (url_id, user_id, content, content_type_id, hits, active, created_at, last_hit) 
VALUES(:urlId, :userId, :content, :contentTypeId, :hits, :active, :created_at, :last_hit)`;

    const params = {
        urlId: postData.urlID,
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

// export const generateUrlKey = async () => {
//     const connection = await db.getConnection();
//     try {
//         await connection.beginTransaction();
//         await connection.query('LOCK TABLES url WRITE');
//
//         const [dbRows] = await connection.query(
//             'SELECT generate_url_friendly_pk() AS url_key;'
//         );
//         const urlKey = dbRows[0].url_key;
//
//         const [existingRows] = await connection.query(
//             'SELECT 1 FROM url WHERE url_id = ?',
//             [urlKey]
//         );
//         if (existingRows.length > 0) {
//             throw new Error('URL key already exists');
//         }
//
//         await connection.query('UNLOCK TABLES');
//         await connection.commit();
//         console.log('successfully generated a URL key:', urlKey);
//         return urlKey;
//     } catch (error) {
//         await connection.rollback();
//         console.error('failed creating a url:', error);
//         throw error;
//     } finally {
//         connection.release();
//     }
//     // const [dbRows] = await db.query('SELECT generate_url_friendly_pk() AS url_key;');
//     // console.log('successfully created an url:', dbRows);
//     // return dbRows[0].url_key;
// };
