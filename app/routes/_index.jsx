export const meta = () => {
    return [
        { title: 'New Remix App' },
        { name: 'description', content: 'Welcome to Remix!' },
    ];
};

export default function Index() {
    return (
        <div className='font-sans p-4'>
            <h1 className='text-3xl'>Login</h1>
            <ul className='list-disc pl-6'>
                <li>
                    <a
                        className='text-blue-700 underline visited:text-purple-900'
                        target='_blank'
                        href='https://remix.run/start/quickstart'
                        rel='noreferrer'
                    >
                        5sm Quick Start
                    </a>
                </li>
                <li>
                    <a
                        className='text-blue-700 underline visited:text-purple-900'
                        target='_blank'
                        href='https://remix.run/start/tutorial'
                        rel='noreferrer'
                    >
                        30m Tutorial
                    </a>
                </li>
                <li>
                    <a
                        className='text-blue-700 underline visited:text-purple-900'
                        target='_blank'
                        href='https://remix.run/docs'
                        rel='noreferrer'
                    >
                        Remix Docs
                    </a>
                </li>
            </ul>
        </div>
    );
}
