import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box } from '@mui/material';

export default function QrScanner({ onScanSuccess }) {
    const scannerRef = useRef(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader", 
            { fps: 10, qrbox: { width: 250, height: 250 } }, 
            false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear(); 
                onScanSuccess(decodedText);
            },
            (errorMessage) => {});

        return () => {
            scanner.clear().catch(error => console.error("Kamera leállítási hiba", error));
        };
    }, [onScanSuccess]);

    return (
        <Box sx={{ width: '100%', maxWidth: '400px', mx: 'auto' }}>
            <div id="reader"></div>
        </Box>
    );
}