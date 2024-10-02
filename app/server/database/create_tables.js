import db from '.';

export async function createTables() {
    try {
        // await createContentTypeTable();
        // await seedContentTypeTable();
        // await createUserTable();
        await createURLTable();
        // await createURLPKStoredFunction();
    } catch (e) {
        console.log('Error creating tables');
        return false;
    }
}

export async function createUserTable() {
    let createUserSQL = `
		CREATE TABLE IF NOT EXISTS user (
            user_id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(25) NOT NULL,
            password VARCHAR(100) NOT NULL,
            PRIMARY KEY (user_id),
            UNIQUE INDEX unique_username (username ASC) VISIBLE);
	`;

    try {
        const results = await db.query(createUserSQL);

        console.log('Successfully created user table');
        return true;
    } catch (err) {
        console.log('Error creating user table: ' + err);
        return false;
    }
}

export async function createContentTypeTable() {
    const createContentTypeTable = `
CREATE TABLE IF NOT EXISTS content_type (
content_id INT NOT NULL,
content_type VARCHAR(100) NOT NULL,
PRIMARY KEY (content_id)
)
`;

    try {
        const results = await db.query(createContentTypeTable);
        console.log('Created Content Type Table');
        console.log(results);

        return true;
    } catch (err) {
        console.log('Error creating tables');

        return false;
    }
}

export async function seedContentTypeTable() {
    const insertContentType = `
 INSERT INTO content_type (content_id, content_type)
 VALUES
     (1, 'Image'),
     (2, 'Text'),
     (3, 'URL');
 `;

    try {
        const results = await db.query(insertContentType);
        console.log('Insert Content Type Table');
        console.log(results);

        return true;
    } catch (err) {
        console.log(err);
        console.log('Error inserting content type tables');

        return false;
    }
}

export async function createURLPKStoredFunction() {
    const createFunctionSQL = `
CREATE FUNCTION check_and_generate_hash(p_value VARCHAR(255)) 
RETURNS VARCHAR(10) DETERMINISTIC 
BEGIN 
    DECLARE v_count INT; 
    DECLARE v_hash VARCHAR(10); 

    -- Check if the value already exists in the table 
    SELECT COUNT(*) INTO v_count 
    FROM url 
    WHERE url_id = p_value; 

    -- If it exists, throw an error 
    IF v_count > 0 THEN 
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Value already exists in the table'; 
    ELSE 
        -- If it does not exist, generate a 10-character hash 
        SET v_hash = SUBSTRING(MD5(p_value), 1, 10); 
        RETURN v_hash; 
    END IF; 
END;
`;

    try {
        const results = await db.query(createFunctionSQL); // Make sure db.query returns a promise
        console.log('Successfully created URL stored function');
    } catch (err) {
        console.log('Error creating URL stored function');
        console.log(err);
        return false;
    }
}

export async function createURLTable() {
    const createURLTable = `
CREATE TABLE IF NOT EXISTS url (
    url_id VARCHAR(100) NOT NULL,
    user_id INT NOT NULL, 
    content VARCHAR(200) NOT NULL,
    content_type_id INT NOT NULL, 
    hits INT NOT NULL,
    active BOOL NOT NULL,
    created_at datetime NOT NULL,     -- renamed 'create' to 'created_at'
    last_hit datetime NOT NULL,
    PRIMARY KEY (url_id),
    FOREIGN KEY (content_type_id) REFERENCES content_type(content_id)
);
`;
    try {
        const results = await db.query(createURLTable);
        console.log('Created URL Table');
        console.log(results);

        return true;
    } catch (err) {
        console.log('Error creating URL tables');
        console.log(err);
        return false;
    }
}
