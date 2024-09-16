import { SignUpForm } from '../components/signup';

export const loader = async () => {
    return null;
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');
};

export default function SignUpPage() {
    return <SignUpForm></SignUpForm>;
}
