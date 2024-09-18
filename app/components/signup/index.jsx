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

export function SignUpForm({ loading, setLoading, open, setOpen }) {
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

                    <Popover
                        opened={open} // Popover will open based on the `open` state
                        onClose={() => setOpen(false)}
                        title='Sign Up Failed'
                        position='bottom'
                        width={260}
                        withArrow
                        shadow='md'
                    >
                        <Popover.Target>
                            <Button
                                onClick={() => {
                                    setLoading(true);
                                }}
                                type='submit'
                                fullWidth
                                mt='xl'
                            >
                                {loading ? (
                                    <>
                                        <Loader size='xs' color='white' />{' '}
                                        {/* Spinner */}
                                        <span style={{ marginLeft: 8 }}>
                                            Signing Up...
                                        </span>
                                    </>
                                ) : (
                                    'Sign up'
                                )}
                            </Button>
                        </Popover.Target>{' '}
                        <Popover.Dropdown>
                            <Text>Sign up failed. Please try again.</Text>
                        </Popover.Dropdown>
                    </Popover>
                </Paper>
            </Form>
        </Container>
    );
}
