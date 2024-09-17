import cx from 'clsx';
import { Box, Stack, Table, ScrollArea, Group, Button } from '@mantine/core';
import classes from './url-dashboard.module.css';
import { useState } from 'react';
import { useActionData } from '@remix-run/react';
import { json } from '@remix-run/node'; // To send a proper response
import { useLoaderData } from '@remix-run/react'; // To access the data in the component


// Server-side data fetching
export const loader = async({requests}) => {
    data = await getContent();  // Fetch the data from your database
    return json({ texts: data }); // Return the data as a JSON response
    // return data
}       

export default function URLDashboard() {
    const [scrolled, setScrolled] = useState(false);
    // const actionData = useActionData();
    const { table } = useLoaderData();
    // For object destructuring 
    console.log(table) 
    const [data, setData] = useState(table); // Initialize state with fetched data


    // Function to update the hit count when a URL is clicked
    const handleLinkClick = async (shortUrl, index) => {
        const response = await fetch('/updateHit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shortUrl })
        });
        const data = await response.json();
        if (data.success) {
            // Update the hit count and last hit locally
            setData((prevData) =>
                prevData.map((row, i) =>
                    i === index
                        ? { ...row, hits: data.hits, last_hit: data.lastHit }
                        : row
                )
            );
        } else {
            console.log('Failed to update hits.');
        }
    };

    const tableRows = data.map((tableRow, index) => (
        <Table.Tr key={tableRow.short_url}>
            <Table.Td>{tableRow.content}</Table.Td>
            <Table.Td>
                <a 
                    href={tableRow.short_url} 
                    className="hit_link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(row.short_url, index);
                }}
                >
                    {tableRow.short_url}
                </a>
            </Table.Td>
            <Table.Td className="hits">{tableRow.hits}</Table.Td>
            <Table.Td>{row.active ? 'Yes' : 'No'}</Table.Td>
            <Table.Td>{tableRow.created}</Table.Td>
            <Table.Td className="last_hit">{tableRow.last_hit}</Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Box className={classes.tablecontainer} my={100}>
                <h1>Get Started by adding a new link, image or text below!</h1>
            </Box>
            <Box my={75}>
                <Box className={classes.tablecontainer}>
                    {' '}
                    <Stack w={'90%'}>
                        <Group>
                            <Button variant='default'>Filter Links</Button>
                            <Button variant='default'>Filter Images</Button>
                            <Button variant='default'>Filter Text</Button>
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
                                        <Table.Th>URL #</Table.Th>
                                        <Table.Th>Content</Table.Th>
                                        <Table.Th>Short URL</Table.Th>
                                        <Table.Th>Hits</Table.Th>
                                        <Table.Th>Active</Table.Th>
                                        <Table.Th>Created</Table.Th>
                                        <Table.Th>Last Hit</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{tableRows}</Table.Tbody>
                            </Table>
                        </ScrollArea>
                    </Stack>
                </Box>
            </Box>
        </>
    );
}
