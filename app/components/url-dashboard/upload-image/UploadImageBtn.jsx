import { useState, useRef } from 'react';
import { Container, FileButton, Button, Group, Text } from '@mantine/core';

// 이 컴포넌트는 사용자가 이미지를 업로드할 수 있는 버튼을 제공합니다.
export function UploadImageButton({ content, setContent }) {
    const resetRef = useRef();

    const clearFile = () => { // clearFile은 선택한 파일을 초기화하는 함수로, 사용자가 선택한 파일을 지울 수 있게 해줌.
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
                    <FileButton     // FileButton을 통해 이미지를 선택하고, setContent로 상태를 업데이트합니다.
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

                {content && ( // 이미지를 선택하면 선택한 파일의 이름이 표시됨. 이를 통해 사용자는 업로드할 파일을 시각적으로 확인할 수 있습니다.
                    <Text size='sm' ta='center' mt='sm'> 
                        Picked file: {content?.name} 
                    </Text>
                )} 
            </Container>
        </>
    );
}
