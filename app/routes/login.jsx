import { LoginForm } from '../components/login';

export const loader = async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    const payload = {
        username: username,
        passowrd: password,
    };
};

export default function LoginPage() {
    return <LoginForm></LoginForm>;
}
