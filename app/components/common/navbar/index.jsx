import { useNavigate, Link } from '@remix-run/react';
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

export default function Navbar() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();

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

                        <a href='/settings' className={classes.link}>
                            Settings
                        </a>
                        {/*
                        <HoverCard
                            width={600}
                            position='bottom'
                            radius='md'
                            shadow='md'
                            withinPortal
                        >
                            <HoverCard.Target>
                                <a href='#' className={classes.link}>
                                    <Center inline>
                                        <Box component='span' mr={5}>
                                            Features
                                        </Box>
                                        <IconChevronDown
                                            style={{
                                                width: rem(16),
                                                height: rem(16),
                                            }}
                                            color={theme.colors.blue[6]}
                                        />
                                    </Center>
                                </a>
                            </HoverCard.Target>

                            <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                                <Group justify='space-between' px='md'>
                                    <Text fw={500}>Features</Text>
                                    <Anchor href='#' fz='xs'>
                                        View all
                                    </Anchor>
                                </Group>

                                <Divider my='sm' />

                                <SimpleGrid cols={2} spacing={0}></SimpleGrid>

                                <div className={classes.dropdownFooter}>
                                    <Group justify='space-between'>
                                        <div>
                                            <Text fw={500} fz='sm'>
                                                Get started
                                            </Text>
                                            <Text size='xs' c='dimmed'>
                                                Their food sources have
                                                decreased, and their numbers
                                            </Text>
                                        </div>
                                        <Button variant='default'>
                                            Get started
                                        </Button>
                                    </Group>
                                </div>
                            </HoverCard.Dropdown>
                        </HoverCard> */}
                    </Group>

                    <Group>
                        <Button variant='default' component={Link} to='/login'>
                            Log in
                        </Button>
                        <Button component={Link} to='/signup'>
                            Sign up
                        </Button>
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
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
