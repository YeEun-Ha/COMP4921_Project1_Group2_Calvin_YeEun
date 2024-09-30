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
import { Form } from '@remix-run/react';
import classes from './login.module.css';
import LogAlert from '../common/alert';
import { useState } from 'react';

export function LoginForm({ actionData }) {
    const [showAlert, setShowAlert] = useState(false);

    return (
        <Container size={420} my={40}>
            <Title ta='center' className={classes.title}>
                Welcome back!
            </Title>
            <Text c='dimmed' size='sm' ta='center' mt={5}>
                Do not have an account yet?{' '}
                <Anchor size='sm' component='button'>
                    Create account
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
                        name='password'
                        placeholder='Your password'
                        required
                        mt='md'
                    />
                    <Group justify='space-between' mt='lg'>
                        <Checkbox label='Remember me' />
                        <Anchor component='button' size='sm'>
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button type='submit' fullWidth mt='xl'>
                        Sign In
                    </Button>
                </Paper>
            </Form>

            {!actionData?.success && actionData?.message ? (
                <LogAlert
                    showAlert={true}
                    message={actionData?.message}
                    color={'red'}
                />
            ) : (
                <></>
            )}

            {actionData?.success == true && actionData?.message ? (
                <LogAlert
                    showAlert={true}
                    message={actionData?.message}
                    color={'teal'}
                />
            ) : (
                <></>
            )}
        </Container>
    );
}
