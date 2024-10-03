import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import {
    Container,
    SimpleGrid,
    Card,
    Text,
    Image,
    AspectRatio,
    Group,
    Title,
} from '@mantine/core';

// Assume this is your server-side data fetching function
import { getContentList } from '../server/controllers/dashbordController';

// Loader function to fetch content data
export const loader = async () => {
    const result = await getContentList();
    return json(result[0]);
};

export default function ExplorePage() {
    const contentList = useLoaderData(); // Fetch the data from the loader
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };
    return (
        <Container py='xl'>
            <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 3 }}
                style={{ gap: '20px' }} // Gap between grid items
            >
                {contentList.slice(0, 5).map((content, index) => (
                    <Card
                        key={content.id || index}
                        h={300}
                        w={290}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between', // Ensure the content and the date are spaced apart
                            border: '1px solid #ddd',
                            backgroundColor: '#f9f9f9',
                            padding: '20px',
                            borderRadius: '8px',
                            transition: 'box-shadow 0.2s',
                            boxShadow: 'none',
                            ':hover': {
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                    >
                        {/* Header for Content Type */}
                        <Title
                            order={4}
                            style={{
                                textAlign: 'center',
                                marginBottom: '10px',
                            }}
                        >
                            {content.content_type_id === 'Image'
                                ? 'Image'
                                : content.content_type_id === 'Text'
                                ? 'Text'
                                : 'URL'}
                        </Title>

                        {/* Content */}
                        {content.content_type_id === 'Image' ? (
                            <a
                                href={content.content}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <AspectRatio ratio={4 / 3}>
                                    <Image
                                        src={content.content}
                                        alt='Content Image'
                                        radius='md'
                                        style={{ borderRadius: '8px' }}
                                    />
                                </AspectRatio>
                            </a>
                        ) : (
                            <Group
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        marginTop: '15px',
                                        fontSize: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {content.contentType === 'Text' ? (
                                        content.content
                                    ) : (
                                        <a
                                            href={content.content}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            style={{
                                                color: 'blue',
                                                textAlign: 'center', // Centered link text
                                                display: 'block',
                                            }}
                                        >
                                            {content.content}
                                        </a>
                                    )}
                                </Text>
                            </Group>
                        )}

                        {/* Date at the bottom */}
                        <Text
                            style={{
                                marginTop: '10px',
                                color: '#888',
                                fontSize: '12px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                alignSelf: 'flex-end', // Puts the date at the bottom
                            }}
                        >
                            {formatDate(content.created_at)}
                        </Text>
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    );
}
