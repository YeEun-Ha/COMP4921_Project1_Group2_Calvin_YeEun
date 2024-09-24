import { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Flex, Box, Container, Drawer, Button } from '@mantine/core';
import { UploadImageButton } from '../upload-image/UploadImageBtn';
import { FloatingIndicator, UnstyledButton } from '@mantine/core';
import { Textarea, TextInput } from '@mantine/core';
import classes from './uploadDrawer.module.css';
import { useFetcher } from '@remix-run/react';

const CONTENT_TYPES = {
    1: 'Image',
    2: 'Text',
    3: 'URL',
};

export function UploadDrawer() {
    const data = Object.values(CONTENT_TYPES);
    const [opened, { open, close }] = useDisclosure(false);
    const [rootRef, setRootRef] = useState();
    const [controlsRefs, setControlsRefs] = useState([]);
    const [active, setActive] = useState(null);
    const fetcher = useFetcher();

    const [content, setContent] = useState(null);

    const setControlRef = (index) => (node) => {
        controlsRefs[index] = node;
        setControlsRefs(controlsRefs);
    };

    const controls = data.map((item, index) => (
        <UnstyledButton
            key={item}
            className={classes.control}
            ref={setControlRef(index + 1)}
            onClick={() => setActive(index + 1)}
            mod={{ active: active === index + 1 }}
        >
            <span className={classes.controlLabel}>{item}</span>
        </UnstyledButton>
    ));

    const handleURLSubmit = async () => {
        const formData = new FormData();

        if (active === 1 && content) {
            formData.append('file', content);
        } else if (active === 2 && content) {
            formData.append('text', content);
        } else if (active === 3 && content) {
            formData.append('url', content);
        }
        formData.append('contentType', active);
        console.log('F12: after appending.. formData:', formData);

        try{
            const url = await fetch('/generateUrl', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                // body: JSON.stringify({}) // empty object 
            });
            const urlData = await url.json();
            console.log('F12: fetched url data', urlData.generatedURL);  
            formData.append('urlID', urlData.generatedURL)
            
        } catch(error) {
            console.log(error);
            console.error('Error fetching url:', error);
        }

        try {
            fetcher.submit(
                formData, // Your form data
                { method: 'post', action: '/api/submitContent' } // The action route
            );

            // const response = await fetch('/api/submitContent', {
            //     method: 'POST',
            //     body: formData,
            // });
        } catch (error) {
            console.log(error);
            console.error('Error submitting content:', error);
        }
        close();
    };
    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.type === 'done') {
            // Submission is done, now load the table data
            fetcher.load('/dashboard');
        }
    }, [fetcher]);
    return (
        <>
            <Drawer
                opened={opened}
                position='right'
                onClose={close}
                title={
                    <div className={classes.drawerTitle}>Upload New Item</div>
                }
            >
                <Container>
                    <h3>Select an option to upload</h3>

                    <div className={classes.root} ref={setRootRef}>
                        {controls}

                        {active !== null && (
                            <FloatingIndicator
                                target={controlsRefs[active]}
                                parent={rootRef}
                                className={classes.indicator}
                            />
                        )}
                    </div>
                </Container>

                <Container my={35} h={125}>
                    {active === 1 ? (
                        <UploadImageButton
                            content={content}
                            setContent={setContent}
                        />
                    ) : (
                        <></>
                    )}
                    {active === 2 ? (
                        <Textarea
                            label='Enter text content below'
                            withAsterisk
                            description='Submitted content will be accessible with a shortened URL!'
                            placeholder='Type you text content here'
                            autosize
                            minRows={2}
                            maxRows={4}
                            onChange={(event) => setContent(event.target.value)}
                        />
                    ) : (
                        <></>
                    )}
                    {active === 3 ? (
                        <TextInput
                            variant='filled'
                            label='URL Input'
                            description='Submit an existing URL to shorten'
                            placeholder='Paste a URL here'
                            onChange={(event) => setContent(event.target.value)}
                        />
                    ) : (
                        <></>
                    )}
                </Container>
                {active !== null ? (
                    <Flex display='flex' w='100%' justify='flex-end'>
                        <Button onClick={handleURLSubmit}>Submit</Button>
                    </Flex>
                ) : (
                    <></>
                )}

                <Container my={30}>
                    <h3>Generated URL:</h3>
                </Container>
            </Drawer>

            <Button onClick={open}>Upload New item</Button>
        </>
    );
}
