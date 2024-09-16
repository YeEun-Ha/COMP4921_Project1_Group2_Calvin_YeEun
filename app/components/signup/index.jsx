import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import classes from '../signup/signup.module.css';
import { useForm } from '@mantine/form';
import { Form, useActionData } from '@remix-run/react';

export function SignUpForm() {
    const actionData = useActionData();

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
        },
    });
    return (
        <Container size={420} my={40}>
            <Title ta='center' className={classes.title}>
                Get Started!
            </Title>
            <Text c='dimmed' size='sm' ta='center' mt={5}>
                Already have an account?{' '}
                <Anchor size='sm' component='button'>
                    Sign In
                </Anchor>
            </Text>
            <Form method='post'>
                <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
                    <TextInput
                        label='Username'
                        name='username'
                        placeholder='Your username'
                        required
                    />
                    <PasswordInput
                        label='Password'
                        placeholder='Your password'
                        name='password'
                        required
                        mt='md'
                    />
                    <Button type='submit' fullWidth mt='xl'>
                        Sign up
                    </Button>
                </Paper>
            </Form>
        </Container>
    );
}
