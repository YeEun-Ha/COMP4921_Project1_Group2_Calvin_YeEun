import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';

export default function LogAlert({ showAlert, message, color }) {
    const icon = <IconInfoCircle />;
    const [visible, setVisible] = useState(showAlert);
    if (!visible) return null; // Don't render the alert if it's not visible

    return (
        <Alert
            m={20}
            variant='light'
            color={color ?? 'teal'}
            radius='lg'
            withCloseButton
            onClose={() => setVisible(false)} // Handle the close button click
            title={message ?? 'Unknown error occurred'}
            icon={icon}
        ></Alert>
    );
}
