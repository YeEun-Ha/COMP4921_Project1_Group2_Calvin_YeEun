export async function action({ request, context }) {
    // Get the session from context (where you've passed `req.session`)
    const { req } = context;

    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) {
                return reject(new Error('Failed to destroy session'));
            }

            // Redirect after session destruction
            resolve(
                redirect('/login', {
                    headers: {
                        'Set-Cookie': '', // Clear the session cookie
                    },
                })
            );
        });
    });
}
