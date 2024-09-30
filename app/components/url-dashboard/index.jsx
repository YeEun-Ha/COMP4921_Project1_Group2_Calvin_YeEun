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


    // 필터링된 데이터를 계산하는 함수
    const filteredData = data.filter((row) => {
        if (filterType === null) return true; // 필터가 없으면 전체 데이터를 보여줌
        return row.content_type_id === filterType;
    });

    const handleFilter = (type) => {
        setFilterType(type); // 필터 타입을 변경
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
                                <Button variant='default' onClick={() => handleFilter(3)}>Links</Button>
                                <Button variant='default' onClick={() => handleFilter(1)}>Images</Button>
                                <Button variant='default' onClick={() => handleFilter(2)}>Texts</Button>
                                <Button variant='default' onClick={() => handleFilter(null)}>
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
