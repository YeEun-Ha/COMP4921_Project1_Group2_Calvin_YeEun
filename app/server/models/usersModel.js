import db from '../database/index.js';

export const createUser = async (postData) => {
    let createUserSQL = `
		INSERT INTO user
		(username, password)
		VALUES
		(:username, :passwordHash);
	`;

    let params = {
        username: postData.username,
        passwordHash: postData.password,
    };

    try {
        const results = await db.query(createUserSQL, params);

        console.log('Successfully created user');
        console.log(results[0]);
        return true;
    } catch (err) {
        console.log('Error inserting user');
        console.log(err);
        return false;
    }
};

export async function getUsers(postData) {
    let getUsersSQL = `
		SELECT username, password
		FROM user;
	`;

    try {
        const params = {
            username: postData.username,
            passwordHash: postData.password,
        };
        const results = await db.query(getUsersSQL, params);

        console.log('Successfully retrieved users');
        console.log(results[0]);
        return results[0];
    } catch (err) {
        console.log('Error getting users');
        console.log(err);
        return false;
    }
}

export async function getUser(postData) {
    let getUserSQL = `
		SELECT user_id, username, password
		FROM user
		WHERE username = :user;
	`;

    // let getUserSQL = `
    // 	SELECT user_id, username, password, type
    // 	FROM user
    // 	JOIN user_type USING (user_type_id)
    // 	WHERE username = :user;
    // `;

    let params = {
        username: postData.username,
    };

    try {
        const results = await db.query(getUserSQL, params);

        console.log('Successfully found user');
        console.log(results[0]);
        return results[0];
    } catch (err) {
        console.log('Error trying to find user');
        console.log(err);
        return false;
    }
}

export async function getContent() {
    let ourTableName = 'texts'
	let getData = `
        SELECT content, short_url, hits, active, created, last_hit 
        FROM ${ourTableName} ;
        `;
	try {
		const results = await db.query(getData);

		console.log(`Successfully retrieved the content from ${ourTableName}`)
		// console.log(results)
		return results;
	} catch (err) {
		console.error('Error fetching data from MySQL:', err);
	}
}

export async function updateHit(ourTableName, shortUrl) {
	let updateData = `
		UPDATE ${ourTableName} 
		SET hits = hits + 1, last_hit = NOW() 
		WHERE short_url = ?      
	`;
	let getData = `
		SELECT hits, last_hit FROM ${ourTableName} 
		WHERE short_url = ?
	`;
	try {
		await db.query(updateData, [shortUrl]);
		const results = await db.query(getData, [shortUrl]);
		
		console.log(`Successfully updated the hit:`, results)
		return results;
	} catch (error) {
		console.error(`Error updating hits:`, error);
		// res.status(500).json({ success: false, message: 'Internal Server Error' });
	}  
}

// module.exports = {createUser, getUsers, getUser, getContent, updateHit};
