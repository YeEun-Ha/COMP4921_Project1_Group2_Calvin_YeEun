import { useState, useRef } from 'react';
import { Container, FileButton, Button, Group, Text } from '@mantine/core';

export function UploadImageButton({ content, setContent }) {
    const resetRef = useRef();

    const clearFile = () => {
        setContent(null);
        resetRef.current?.();
    };

    return (
        <>
            <Container style={{ textAlign: 'center' }}>
                <Text inline={true}>
                    Upload a new image and submit to generate a new URL
                </Text>
                <br />
                <Group justify='center'>
                    <FileButton
                        resetRef={resetRef}
                        onChange={setContent}
                        accept='image/png,image/jpeg'
                    >
                        {(props) => <Button {...props}>Upload image</Button>}
                    </FileButton>
                    <Button disabled={!content} color='red' onClick={clearFile}>
                        Reset
                    </Button>
                </Group>

                {content && (
                    <Text size='sm' ta='center' mt='sm'>
                        Picked file: {content?.name}
                    </Text>
                )}
            </Container>
        </>
    );
}
