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
    Popover,
    Loader,
} from '@mantine/core';
import classes from '../signup/signup.module.css';
import { useForm } from '@mantine/form';
import { Form, useNavigate, useActionData } from '@remix-run/react';
import LogAlert from '../common/alert';

export function SignUpForm({ actionData }) {
    console.log(actionData);
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
                        Sign Up
                    </Button>
                </Paper>
            </Form>

            {actionData?.errors?.length > 0 ? (
                actionData.errors.map((error, index) => (
                    <LogAlert showAlert={true} message={error} color={'red'} />
                ))
            ) : (
                <></>
            )}

            {actionData?.success == true ? (
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
