import cx from 'clsx';
import {
    Box,
    Stack,
    Table,
    ScrollArea,
    Group,
    Button,
    ActionIcon,
} from '@mantine/core';
import classes from './url-dashboard.module.css';
import { useState, useEffect } from 'react';
import { UploadDrawer } from './upload-drawer/UploadDrawer';
import { useNavigate, useFetcher } from '@remix-run/react';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function URLDashboard({ loaderData }) {
    const navigate = useNavigate();
    const fetcher = useFetcher();

    const [scrolled, setScrolled] = useState(false);
    const table = loaderData?.table?.[0] ?? [];
    const userId = loaderData?.userId;

    const [data, setData] = useState(table ?? []); // Initialize state with fetched data
    // console.log(`table -->`, table)
    const [baseURL, setBaseUrl] = useState('');
    const [filterType, setFilterType] = useState(null);

    const handleActiveStatus = async (urlId, userId, activeStatus) => {
        const formData = new FormData();
        formData.append('urlId', urlId);
        formData.append('userId', userId);
        formData.append('active', activeStatus);

        try {
            fetcher.submit(formData, {
                method: 'POST',
                action: '/api/updateContentStatus',
            });
        } catch (err) {
            console.log('Error updating active status');
        }
    };

    const handleLinkClick = async (shortUrl, index) => {
        const response = await fetch('/updateHit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shortUrl }),
        });
        const fetchedData = await response.json();

        if (fetchedData.success) {
            // Update the hit count and last hit locally
            setData((prevData) =>
                prevData.map((row, i) =>
                    i === index
                        ? {
                              ...row,
                              hits: fetchedData.hits,
                              last_hit: fetchedData.lastHit,
                          }
                        : row
                )
            );
        } else {
            console.log('Failed to update hits.');
        }

        navigate(`/${shortUrl}`);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentBaseUrl = `${window.location.protocol}//${window.location.host}/`;
            setBaseUrl(currentBaseUrl);
        }
    }, []);

    useEffect(() => {
        setData(table);
    }, [table]);
    

    const filteredData = filterType 
    ? data.filter((row) => row.content_type_id === filterType) 
    : data;
    
    const handleFilter = (type) => {
        setFilterType(type);
    };


    return (
        <>
            <Box className={classes.tablecontainer} my={25}>
                <h4>Get Started by adding a new link, image or text!</h4>
            </Box>

            <Box my={10}>
                <Box className={classes.tablecontainer}>
                    {' '}
                    <Stack w={'90%'}>
                        <Group justify='space-between'>
                            <Group>
                                <Button
                                    variant='default'
                                    onClick={() => handleFilter(`URL`)}
                                >
                                    Links
                                </Button>
                                <Button
                                    variant='default'
                                    onClick={() => handleFilter(`Image`)}
                                >
                                    Images
                                </Button>
                                <Button
                                    variant='default'
                                    onClick={() => handleFilter(`Text`)}
                                >
                                    Texts
                                </Button>
                                <Button
                                    variant='default'
                                    onClick={() => handleFilter(null)}
                                >
                                    Reset Filter
                                </Button>
                            </Group>
                            <Group>
                                {' '}
                                <UploadDrawer data={data} setData={setData} />
                            </Group>
                        </Group>

                        <ScrollArea
                            h={'100%'}
                            w={'100%'}
                            onScrollPositionChange={({ y }) =>
                                setScrolled(y !== 0)
                            }
                        >
                            <Table
                                miw={700}
                                horizontalSpacing='xs'
                                verticalSpacing='md'
                            >
                                <Table.Thead
                                    className={cx(classes.header, {
                                        [classes.scrolled]: scrolled,
                                    })}
                                >
                                    <Table.Tr>
                                        <Table.Th>URL</Table.Th>
                                        <Table.Th>Username</Table.Th>
                                        <Table.Th>Content Type</Table.Th>
                                        <Table.Th>Content Preview</Table.Th>
                                        <Table.Th>Hits</Table.Th>
                                        <Table.Th>Active</Table.Th>
                                        <Table.Th>Created</Table.Th>
                                        <Table.Th>Last Hit</Table.Th>
                                        <Table.Th>Toggle Active</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {filteredData.map((dbRow, index) => {
                                        const isOwner =
                                            dbRow.user_id === userId;
                                        return (
                                            <Table.Tr key={dbRow.url_id}>
                                                <Table.Td>
                                                    <a
                                                        href={dbRow.url_id}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleLinkClick(
                                                                dbRow.url_id,
                                                                index
                                                            );
                                                        }}
                                                    >
                                                        {baseURL}
                                                        {dbRow.url_id}
                                                    </a>
                                                </Table.Td>
                                                <Table.Td>
                                                    {dbRow.userId}
                                                </Table.Td>
                                                <Table.Td>
                                                    {dbRow.content_type_id}
                                                </Table.Td>
                                                <Table.Td>
                                                    <div
                                                        style={{
                                                            whiteSpace:
                                                                'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow:
                                                                'ellipsis',
                                                            maxWidth: '150px',
                                                        }}
                                                    >
                                                        {dbRow.content}
                                                    </div>
                                                </Table.Td>
                                                <Table.Td>
                                                    {dbRow.hits}
                                                </Table.Td>
                                                <Table.Td>
                                                    {dbRow.active
                                                        ? 'Yes'
                                                        : 'No'}
                                                </Table.Td>
                                                <Table.Td>
                                                    {
                                                        dbRow.created_at.split(
                                                            'T'
                                                        )[0]
                                                    }
                                                </Table.Td>
                                                <Table.Td>
                                                    {
                                                        dbRow.last_hit.split(
                                                            'T'
                                                        )[0]
                                                    }
                                                </Table.Td>
                                                <Table.Td>
                                                    {isOwner && (
                                                        <Group>
                                                            <ActionIcon
                                                                color='green'
                                                                disabled={
                                                                    dbRow.active
                                                                }
                                                                onClick={() =>
                                                                    handleActiveStatus(
                                                                        dbRow.url_id,
                                                                        dbRow.user_id,
                                                                        1
                                                                    )
                                                                }
                                                            >
                                                                <IconCheck
                                                                    size={16}
                                                                />
                                                            </ActionIcon>

                                                            <ActionIcon
                                                                color='red'
                                                                disabled={
                                                                    !dbRow.active
                                                                }
                                                                onClick={() =>
                                                                    handleActiveStatus(
                                                                        dbRow.url_id,
                                                                        dbRow.user_id,
                                                                        0
                                                                    )
                                                                }
                                                            >
                                                                <IconX
                                                                    size={16}
                                                                />
                                                            </ActionIcon>
                                                        </Group>
                                                    )}
                                                </Table.Td>
                                            </Table.Tr>
                                        );
                                    })}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>
                    </Stack>
                </Box>
            </Box>
        </>
    );
}
