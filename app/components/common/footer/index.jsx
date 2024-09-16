import { Text, Container, ActionIcon, Group, rem } from '@mantine/core';
import {
    IconBrandTwitter,
    IconBrandYoutube,
    IconBrandInstagram,
} from '@tabler/icons-react';
import classes from './footer.module.css';

export default function Footer() {
    return (
        <footer className={classes.footer}>
            <Text c='dimmed' size='sm'>
                Project 1 By Calvin Vu & YeEun Ha
            </Text>

            <Group
                gap={0}
                className={classes.social}
                justify='flex-end'
                wrap='nowrap'
            >
                <ActionIcon size='lg' color='gray' variant='subtle'>
                    <IconBrandTwitter
                        style={{ width: rem(18), height: rem(18) }}
                        stroke={1.5}
                    />
                </ActionIcon>
                <ActionIcon size='lg' color='gray' variant='subtle'>
                    <IconBrandYoutube
                        style={{ width: rem(18), height: rem(18) }}
                        stroke={1.5}
                    />
                </ActionIcon>
                <ActionIcon size='lg' color='gray' variant='subtle'>
                    <IconBrandInstagram
                        style={{ width: rem(18), height: rem(18) }}
                        stroke={1.5}
                    />
                </ActionIcon>
            </Group>
        </footer>
    );
}
