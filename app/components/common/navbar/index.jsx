import { useNavigate, useFetcher, Link } from '@remix-run/react';
import {
    HoverCard,
    Group,
    Button,
    UnstyledButton,
    Text,
    SimpleGrid,
    ThemeIcon,
    Anchor,
    Divider,
    Center,
    Box,
    Burger,
    Drawer,
    Collapse,
    ScrollArea,
    rem,
    useMantineTheme,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconNotification,
    IconCode,
    IconBook,
    IconChartPie3,
    IconFingerprint,
    IconCoin,
    IconChevronDown,
} from '@tabler/icons-react';
import classes from './navbar.module.css';

export default function Navbar({ userId, authenticated }) {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();
    const fetcher = useFetcher();

    const handleLogout = async () => {
        const formData = new FormData();

        if (!authenticated) return;
        console.log(userId);
        formData.append('userId', userId);

        try {
            fetcher.submit(formData, {
                method: 'POST',
                action: '/api/logout',
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Box pb={20}>
            <header className={classes.header}>
                <Group justify='space-between' h='100%'>
                    <Group h='100%' gap={0} visibleFrom='sm'>
                        <Title order={2} size={20}>
                            URL Shortener
                        </Title>
                    </Group>
                    <Group h='100%' gap={1} visibleFrom='sm'>
                        <a href='/' className={classes.link}>
                            Home
                        </a>

                        <a href='/dashboard' className={classes.link}>
                            Dashboard
                        </a>

                        <a href='/explore' className={classes.link}>
                            Explore
                        </a>
                    </Group>

                    <Group>
                        {authenticated ? (
                            <Button
                                variant='default'
                                component={Link}
                                onClick={handleLogout}
                            >
                                Log Out
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant='default'
                                    component={Link}
                                    to='/login'
                                >
                                    Log in
                                </Button>
                                <Button component={Link} to='/signup'>
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Group>

                    <Burger
                        opened={drawerOpened}
                        onClick={toggleDrawer}
                        hiddenFrom='sm'
                    />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size='100%'
                padding='md'
                title='Navigation'
                hiddenFrom='sm'
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx='-md'>
                    <Divider my='sm' />

                    <a href='/' className={classes.link}>
                        Home
                    </a>

                    <a href='/dashboard' className={classes.link}>
                        Dashboard
                    </a>

                    <a href='/settings' className={classes.link}>
                        Settings
                    </a>
                    {/*
                    <UnstyledButton
                        className={classes.link}
                        onClick={toggleLinks}
                    >
                        <Center inline>
                            <Box component='span' mr={5}>
                                Features
                            </Box>
                            <IconChevronDown
                                style={{ width: rem(16), height: rem(16) }}
                                color={theme.colors.blue[6]}
                            />
                        </Center>
                    </UnstyledButton>
                    {/* <Collapse in={linksOpened}>{links}</Collapse> */}
                    <Divider my='sm' />

                    <Group justify='center' grow pb='xl' px='md'>
                        {authenticated ? (
                            <Button
                                onClick={closeDrawer}
                                variant='default'
                                component={Link}
                                to='/login'
                            >
                                Log Out
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={closeDrawer}
                                    variant='default'
                                    component={Link}
                                    to='/login'
                                >
                                    Log in
                                </Button>
                                <Button
                                    onClick={closeDrawer}
                                    component={Link}
                                    to='/signup'
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
