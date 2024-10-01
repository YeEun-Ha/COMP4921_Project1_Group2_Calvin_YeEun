import { Link } from '@remix-run/react';
import { Title, Text, Button, Container } from '@mantine/core';
import classes from './home.module.css';
import { useState, useEffect } from 'react';
import LogAlert from '../common/alert';

export default function HomePage({ authenticated }) {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (!authenticated) {
            setShowAlert(true);
        }
    }, [authenticated]);

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

                {!authenticated ? (
                    <>
                        <Container p={0} size={600}>
                            <Text
                                size='lg'
                                c='dimmed'
                                className={classes.description}
                            >
                                Sign up or Login to an existing account to get
                                started!
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
                    </>
                ) : (
                    <>
                        <Container p={0} size={600}>
                            <Text
                                size='lg'
                                c='dimmed'
                                className={classes.description}
                            >
                                Visit the dashboard now to get started!
                            </Text>
                        </Container>
                        <div className={classes.controls}>
                            <Button
                                variant='default'
                                size='lg'
                                className={classes.control}
                                component={Link}
                                to='/dashboard'
                            >
                                View Dashboard
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Container>
    );
}
