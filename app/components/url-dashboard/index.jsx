import cx from 'clsx';
import { Box, Stack, Table, ScrollArea, Group, Button } from '@mantine/core';
import classes from './url-dashboard.module.css';
import { useState, useEffect } from 'react';
import { UploadDrawer } from './upload-drawer/UploadDrawer';

export default function URLDashboard({ loaderData }) {
    const [scrolled, setScrolled] = useState(false);
    const table = loaderData?.table?.[0] ?? [];
    // console.log("successful until loaderData:", table)
    const [data, setData] = useState(table ?? []); // Initialize state with fetched data

    // Function to update the hit count when a URL is clicked
    const handleLinkClick = async (shortUrl, index) => {
        const response = await fetch('/updateHit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shortUrl }),
        });
        const fetchedData = await response.json();
        console.log('F12: the fetched data', fetchedData);

        if (fetchedData.success) {
            // Update the hit count and last hit locally
            setData((prevData) =>
                prevData.map((row, i) =>
                    i === index
                        ? { ...row, hits: fetchedData.hits, last_hit: fetchedData.lastHit }
                        : row
                )
            );
        } else {
            console.log('Failed to update hits.');
        }
    };

    useEffect(() => {
        setData(table);
    }, [table]);

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
                                <Button variant='default'>Filter Links</Button>
                                <Button variant='default'>Filter Images</Button>
                                <Button variant='default'>Filter Text</Button>
                            </Group>
                            <Group>
                                {' '}
                                <UploadDrawer data={data} setData={setData} />
                            </Group>
                        </Group>

                        <ScrollArea
                            h={300}
                            w={'100%'}
                            onScrollPositionChange={({ y }) =>
                                setScrolled(y !== 0)
                            }
                        >
                            <Table miw={700}>
                                <Table.Thead
                                    className={cx(classes.header, {
                                        [classes.scrolled]: scrolled,
                                    })}
                                >
                                    <Table.Tr>
                                        <Table.Th>URL</Table.Th>
                                        <Table.Th>Content Type</Table.Th>
                                        <Table.Th>Content</Table.Th>
                                        <Table.Th>Hits</Table.Th>
                                        <Table.Th>Active</Table.Th>
                                        <Table.Th>Created</Table.Th>
                                        <Table.Th>Last Hit</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {data.map((dbRow, index) => (
                                        <Table.Tr key={dbRow.url_id}>
                                            <Table.Td>
                                                <a
                                                    href={dbRow.url_id}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    onClick={(e) => {
                                                        // e.preventDefault();
                                                        handleLinkClick(
                                                            dbRow.url_id,
                                                            index
                                                        );
                                                    }}
                                                >
                                                    {dbRow.url_id}
                                                </a>
                                            </Table.Td>
                                            <Table.Td>
                                                {dbRow.content_type_id}
                                            </Table.Td>
                                            <Table.Td>
                                                {dbRow.content}
                                            </Table.Td>
                                            <Table.Td>{dbRow.hits}</Table.Td>
                                            <Table.Td>
                                                {dbRow.active ? 'Yes' : 'No'}
                                            </Table.Td>
                                            <Table.Td>
                                                {dbRow.created_at}
                                            </Table.Td>
                                            <Table.Td>
                                                {dbRow.last_hit}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>
                    </Stack>
                </Box>
            </Box>
        </>
    );
}
