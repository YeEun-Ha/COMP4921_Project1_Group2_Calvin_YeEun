import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Flex, Box, Container, Drawer, Button } from '@mantine/core';
import { UploadImageButton } from '../upload-image/UploadImageBtn';
import { FloatingIndicator, UnstyledButton } from '@mantine/core';
import { Textarea, TextInput } from '@mantine/core';
import classes from './uploadDrawer.module.css';

export function UploadDrawer() {
    const data = ['Image', 'Text', 'URL'];
    const [opened, { open, close }] = useDisclosure(false);
    const [rootRef, setRootRef] = useState();
    const [controlsRefs, setControlsRefs] = useState([]);
    const [active, setActive] = useState(null);

    const [content, setContent] = useState(null);

    const setControlRef = (index) => (node) => {
        controlsRefs[index] = node;
        setControlsRefs(controlsRefs);
    };

    const controls = data.map((item, index) => (
        <UnstyledButton
            key={item}
            className={classes.control}
            ref={setControlRef(index)}
            onClick={() => setActive(index)}
            mod={{ active: active === index }}
        >
            <span className={classes.controlLabel}>{item}</span>
        </UnstyledButton>
    ));

    const handleURLSubmit = async () => {
        const response = await fetch('/api/submitContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: content,
        });
    };

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
                    {active === 0 ? (
                        <UploadImageButton
                            content={content}
                            setContent={setContent}
                        />
                    ) : (
                        <></>
                    )}
                    {active === 1 ? (
                        <Textarea
                            label='Enter text content below'
                            withAsterisk
                            description='Submitted content will be accessible with a shortened URL!'
                            placeholder='Type you text content here'
                            autosize
                            minRows={2}
                            maxRows={4}
                        />
                    ) : (
                        <></>
                    )}
                    {active === 2 ? (
                        <TextInput
                            variant='filled'
                            label='URL Input'
                            description='Submit an existing URL to shorten'
                            placeholder='Paste a URL here'
                        />
                    ) : (
                        <></>
                    )}
                </Container>
                {active !== null ? (
                    <Flex display='flex' w='100%' justify='flex-end'>
                        <Button>Submit</Button>
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
