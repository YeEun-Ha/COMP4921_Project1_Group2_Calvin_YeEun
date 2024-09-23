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
        const data = await response.json();
        console.log('let me show you the fetched data', data);

        if (data.success) {
            // Update the hit count and last hit locally
            setData((prevData) =>
                prevData.map((row, i) =>
                    i === index // 클릭된 URL에 해당하는 행의 경우
                        ? { ...row, hits: data.hits, last_hit: data.lastHit } // [...어레이] {...옵젝트} 딥카피 Spread operator
                        : row // 그 외의 행은 변경 없이 그대로 반환
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
                                    {data.map((tableRow, index) => (
                                        <Table.Tr key={tableRow.url_id}>
                                            <Table.Td>
                                                <a
                                                    href={tableRow.url_id}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleLinkClick(
                                                            tableRow.url_id,
                                                            index
                                                        );
                                                    }}
                                                >
                                                    {tableRow.url_id}
                                                </a>
                                            </Table.Td>
                                            <Table.Td>
                                                {tableRow.content_type_id}
                                            </Table.Td>
                                            <Table.Td>
                                                {tableRow.content}
                                            </Table.Td>
                                            <Table.Td>{tableRow.hits}</Table.Td>
                                            <Table.Td>
                                                {tableRow.active ? 'Yes' : 'No'}
                                            </Table.Td>
                                            <Table.Td>
                                                {tableRow.created_at}
                                            </Table.Td>
                                            <Table.Td>
                                                {tableRow.last_hit}
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
