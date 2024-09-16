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
        </div>
    );
}
