import { useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { getContentItem } from '../server/controllers/dashbordController';
import { json } from '@remix-run/node'; // Ensure this import is from Remix node
import {
    Box,
    Text,
    Group,
    Image,
    Loader,
    Center,
    Paper,
    Title,
    Stack,
} from '@mantine/core';

export const loader = async ({ request, params }) => {
    const urlID = params.url; // Extract the urlID from params
    const data = await getContentItem({ urlID }); // Get the content item
    return json({ success: true, data: data });
};

export default function URLContent() {
    const data = useLoaderData(); // Get the data from loader
    const navigate = useNavigate(); // Hook to handle redirects
    const [countdown, setCountdown] = useState(5); // State to manage countdown

    const isActive = data.data.active;

    useEffect(() => {
        if (
            data.data.active &&
            (data.data.content_type_id === 3 || data.data.content_type_id === 1)
        ) {
            const intervalId = setInterval(() => {
                setCountdown((prevCount) => prevCount - 1);
            }, 1000);

            const timeoutId = setTimeout(() => {
                window.location.href = data.data.content; // Redirect to the URL in 'content'
            }, 5000);

            return () => {
                clearInterval(intervalId); // Cleanup interval on component unmount
                clearTimeout(timeoutId); // Cleanup timeout
            };
        }
    }, [data.data.active, data.data.content_type_id, data.data.content]);

    const contentMetadata = (
        <Box
            mt='md'
            p='md'
            sx={(theme) => ({
                backgroundColor: theme.colors.gray[1], // Slightly darker background for metadata
                borderRadius: theme.radius.sm, // Small radius for rounded edges
                border: `1px solid ${theme.colors.gray[3]}`, // Light gray border
                textAlign: 'center',
            })}
        >
            <Text color='dimmed' size='sm'>
                User ID: {data.data.user_id}
            </Text>
            <Text color='dimmed' size='sm'>
                Created At: {new Date(data.data.created_at).toLocaleString()}
            </Text>
            <Text color='dimmed' size='sm'>
                Active: {data.data.active ? 'Yes' : 'No'}
            </Text>
            <Text color='dimmed' size='sm'>
                Hits: {data.data.hits}
            </Text>
        </Box>
    );

    if (data.data && !isActive) {
        return (
            <Center>
                <Paper shadow='xs' padding='md' radius='md' withBorder>
                    <Title align='center' color='red' order={2}>
                        The resouce you are trying to access is currently not
                        active!
                    </Title>
                </Paper>
            </Center>
        );
    }

    if (data.data)
        if (data.data.content_type_id === 1) {
            return (
                <Center>
                    <Paper
                        w='60%'
                        shadow='xs'
                        padding='md'
                        radius='md'
                        withBorder
                    >
                        <Title align='center' c='blue' order={2}>
                            Redirecting to image in {countdown} seconds...
                        </Title>
                        <Center p='40'>
                            <Loader m='5' size='md' />
                        </Center>
                        <Center></Center>
                        <Center mt='md'>
                            <Text align='center' size='md'>
                                or click{' '}
                                <a
                                    href={data.data.content}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    style={{
                                        color: 'blue',
                                        textDecoration: 'underline',
                                    }}
                                >
                                    here
                                </a>{' '}
                                to go now
                            </Text>
                        </Center>
                        <Title mt='30' align='center' color='teal' order={2}>
                            Preview Image
                        </Title>
                        <Image
                            src={data.data.content}
                            alt='User Content'
                            fit='contain'
                            width={400}
                            height={300}
                        />
                        {contentMetadata}
                    </Paper>
                </Center>
            );
        }

    if (data.data.content_type_id === 2) {
        return (
            <Center>
                <Paper
                    w='70%'
                    p='50'
                    shadow='xs'
                    padding='md'
                    radius='md'
                    withBorder
                >
                    <Title align='center' color='blue' order={2}>
                        View your Text Content
                    </Title>
                    <Box p='100' withBorder radius='md'>
                        <Text color='dark' size='md' align='center' mt='md'>
                            {data.data.content}
                        </Text>
                    </Box>
                    <Box>{contentMetadata}</Box>
                </Paper>
            </Center>
        );
    }

    if (data.data.content_type_id === 3) {
        // Redirect with a 5-second countdown
        return (
            <Center>
                <Paper
                    w='70%'
                    p='50'
                    shadow='xs'
                    padding='md'
                    radius='md'
                    withBorder
                >
                    <Title align='center' c='blue' order={2}>
                        Redirecting to content URL in {countdown} seconds...
                    </Title>
                    <Center p='40'>
                        <Loader m='5' size='md' />
                    </Center>
                    <Center></Center>
                    <Center mt='md'>
                        <Text align='center' size='md'>
                            or click{' '}
                            <a
                                href={data.data.content}
                                target='_blank'
                                rel='noopener noreferrer'
                                style={{
                                    color: 'blue',
                                    textDecoration: 'underline',
                                }}
                            >
                                here
                            </a>{' '}
                            to go now
                        </Text>
                    </Center>
                    {contentMetadata}
                </Paper>
            </Center>
        );
    }

    return (
        <Center>
            <Paper shadow='xs' padding='md' radius='md' withBorder>
                <Title align='center' color='red' order={2}>
                    Content not found
                </Title>
            </Paper>
        </Center>
    );
}
