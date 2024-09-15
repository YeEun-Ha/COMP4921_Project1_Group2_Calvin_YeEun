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

export function SignUpForm() {
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

            <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
                <TextInput
                    label='Email'
                    placeholder='you@mantine.dev'
                    required
                />
                <PasswordInput
                    label='Password'
                    placeholder='Your password'
                    required
                    mt='md'
                />
                <Button fullWidth mt='xl'>
                    Sign up
                </Button>
            </Paper>
        </Container>
    );
}
