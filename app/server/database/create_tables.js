import db from '.';

export async function createTables() {
    try {
        await createUserTable();
        await createURLTable();
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

export async function createURLTable() {
    const createURLTable = `
CREATE TABLE IF NOT EXISTS url (
    url_id INT NOT NULL AUTO_INCREMENT,
    content VARCHAR(200) NOT NULL,
    hits INT NOT NULL,
    active BOOL NOT NULL,
    created_at DATE NOT NULL,     -- renamed 'create' to 'created_at'
    last_hit DATE NOT NULL,
    PRIMARY KEY (url_id)
);
`;
    try {
        const results = await db.query(createURLTable);
        console.log('Created URL Table');
        console.log(results);

        return true;
    } catch (err) {
        console.log('Error creating tables');

        return false;
    }
}
