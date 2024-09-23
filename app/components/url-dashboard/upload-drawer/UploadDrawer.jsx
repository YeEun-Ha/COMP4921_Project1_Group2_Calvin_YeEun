import { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks'; // 드로어 열고 닫는 상태 관리용 훅
import { Flex, Box, Container, Drawer, Button } from '@mantine/core'; // Mantine 컴포넌트들
import { UploadImageButton } from '../upload-image/UploadImageBtn'; // 이미지 업로드 버튼 컴포넌트
import { FloatingIndicator, UnstyledButton } from '@mantine/core'; // 플로팅 효과와 버튼
import { Textarea, TextInput } from '@mantine/core'; // 텍스트 입력 및 URL 입력 폼
import classes from './uploadDrawer.module.css';
import { useFetcher } from '@remix-run/react'; // Remix에서 서버 요청을 위한 Fetcher 사용

const CONTENT_TYPES = {
    1: 'Image',
    2: 'Text',
    3: 'URL',
};

export function UploadDrawer() {
    // 상태 관리: useState로 
    // opened(드로어 열림/닫힘 상태), active(선택된 콘텐츠 타입), 
    // content(업로드할 콘텐츠)를 관리합니다.
    const data = Object.values(CONTENT_TYPES); // CONTENT_TYPES의 값들을 배열로 가져옴
    const [opened, { open, close }] = useDisclosure(false); // 드로어 열고 닫기 상태 관리
    const [rootRef, setRootRef] = useState(); // 드로어 내부 요소를 참조하는 상태
    const [controlsRefs, setControlsRefs] = useState([]); // 각 버튼에 대한 참조 배열
    const [active, setActive] = useState(null); // 선택한 콘텐츠 타입의 상태 관리
    const fetcher = useFetcher();

    const [content, setContent] = useState(null); // 사용자 입력(파일, 텍스트, URL)의 상태 관리

    // 버튼 요소를 참조로 설정하는 함수
    const setControlRef = (index) => (node) => {
        controlsRefs[index] = node; // 각 버튼을 참조 배열에 저장
        setControlsRefs(controlsRefs); // 참조 배열 상태 업데이트
    };

    // controls 배열은 각 콘텐츠 타입(이미지, 텍스트, URL)을 선택할 수 있는 버튼을 생성.
    const controls = data.map((item, index) => (
        <UnstyledButton
            key={item} // 고유한 키 값
            className={classes.control} 
            ref={setControlRef(index + 1)} // 각 버튼의 참조 설정
            onClick={() => setActive(index + 1)} // 클릭 시 활성화된 타입 설정
            mod={{ active: active === index + 1 }} // 활성화된 타입과 비교
        > 
            <span className={classes.controlLabel}>{item}</span> 
        </UnstyledButton> // ↑ 버튼의 라벨
    ));

    // 선택한 콘텐츠 타입에 따라 적절한 데이터를 FormData에 담아 서버로 제출하는 함수. 
    // 드로어가 닫히고, 서버 응답을 처리합니다.
    const handleURLSubmit = async () => {
        const formData = new FormData(); // FormData 객체 생성

        // 선택한 콘텐츠 타입에 맞춰 FormData에 추가
        if (active === 1 && content) {
            formData.append('file', content); // 이미지인 경우
        } else if (active === 2 && content) {
            formData.append('text', content);
        } else if (active === 3 && content) {
            formData.append('url', content);
        }
        formData.append('contentType', active); // 콘텐츠 타입 추가
        console.log('F12: after appending.. formData:', formData);
        
        try{
            const url = await fetch('/generateUrl', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                // body: JSON.stringify({}) // empty object 전달
            });
            const urlData = await url.json();
            console.log('F12: fetched url data', urlData.generatedURL);  

            formData.append('urlID', urlData.generatedURL)
            
        } catch(error) {
            console.log(error);
            console.error('Error fetching url:', error);
        }

        try {
            fetcher.submit( // FormData를 서버에 제출
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
        close(); // 제출 후 드로어 닫기
    };

    // 제출 후, fetcher 상태를 감지하여 대시보드 데이터를 다시 로드.
    useEffect(() => { 
        if (fetcher.state === 'idle' && fetcher.type === 'done') { // fetcher 상태가 'idle'이고 작업이 완료되었을 때
            // Submission is done, now load the table data
            fetcher.load('/dashboard'); // 대시보드 갱신
        }
    }, [fetcher]);

    return (
        <>
            <Drawer
                opened={opened} // 드로어 열림 상태 확인 
                position='right'
                onClose={close}
                title={
                    <div className={classes.drawerTitle}>Upload New Item</div>
                } // 드로어 제목
            >
                {/* 콘텐츠 타입 선택 */} 
                <Container> 
                    <h3>Select an option to upload</h3>

                    <div className={classes.root} ref={setRootRef}>
                        {controls} {/* 콘텐츠 타입 버튼들 */}

                        {active !== null && (
                            <FloatingIndicator
                                target={controlsRefs[active]} // 활성화된 버튼 참조
                                parent={rootRef} // 부모 참조
                                className={classes.indicator}
                            />
                        )}
                    </div>
                </Container>

                {/* 콘텐츠 입력 필드 */}
                <Container my={35} h={125}>
                    {active === 1 ? (
                        <UploadImageButton
                            content={content} // 이미지 파일 상태
                            setContent={setContent} // 상태 변경 함수
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
                            onChange={(event) => setContent(event.target.value)} // 입력 내용 상태 관리
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
                            onChange={(event) => setContent(event.target.value)} // 입력 URL 상태 관리
                        />
                    ) : (
                        <></>
                    )}
                </Container>

                {/* 제출 버튼 */}
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

            {/* 드로어 열기 버튼 */}
            <Button onClick={open}>Upload New item</Button>
        </>
    );
}
