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
    const connection = await db.getConnection(); // connection pool에서 새 연결을 가져옵니다.

    try{
        await connection.beginTransaction();
        await connection.query('LOCK TABLES url WRITE');

        // MySQL stored function을 통해 URL 키 생성
        const [dbRows] = await connection.query('SELECT generate_url_friendly_pk() AS url_key;');
        const urlKey = dbRows[0].url_key;

        // 생성된 URL 키가 중복인지 확인
        const [existingRows] = await connection.query('SELECT 1 FROM url WHERE url_id = ?', [urlKey]);
        if (existingRows.length > 0) {
             throw new Error('URL key already exists');
        }

        await connection.query('UNLOCK TABLES');
        await connection.commit();

        console.log('성공적으로 URL 키 생성:', urlKey);
        return urlKey;
    
    } catch (error) {
        await connection.rollback();
        console.error('URL 키 생성 실패:', error);
        throw error;

    } finally {
        connection.release();
    }
    // const [dbRows] = await db.query('SELECT generate_url_friendly_pk() AS url_key;');
    // console.log('successfully created an url:', dbRows);
    // return dbRows[0].url_key;
}
