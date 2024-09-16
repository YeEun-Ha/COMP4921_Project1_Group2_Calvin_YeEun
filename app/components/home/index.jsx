import { Link } from '@remix-run/react';
import { Title, Text, Button, Container } from '@mantine/core';
import classes from './home.module.css';

export default function HomePage() {
    return (
        <Container className={classes.wrapper} size={1400}>
            <div className={classes.inner}>
                <Title className={classes.title}>
                    The All in One{' '}
                    <Text
                        component='span'
                        className={classes.highlight}
                        inherit
                    >
                        URL Shortener
                    </Text>{' '}
                </Title>

                <Container p={0} size={600}>
                    <Text size='lg' c='dimmed' className={classes.description}>
                        Image, Text and Links supported! Upload and track all
                        your URLs with ease
                    </Text>
                </Container>

                <Container p={0} size={600}>
                    <Text size='lg' c='dimmed' className={classes.description}>
                        Sign up or Login to an existing account to get started!
                    </Text>
                </Container>
                <div className={classes.controls}>
                    <Button
                        variant='default'
                        size='lg'
                        className={classes.control}
                        component={Link}
                        to='/login'
                    >
                        Log in
                    </Button>
                    <Button
                        variant='default'
                        size='lg'
                        className={classes.control}
                        component={Link}
                        to='/signup'
                    >
                        Sign up
                    </Button>
                </div>
            </div>
        </Container>
    );
}
