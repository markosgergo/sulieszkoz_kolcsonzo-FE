import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box } from '@mui/material';

export default function QrScanner({ onScanSuccess }) {
    const scannerRef = useRef(null);

    useEffect(() => {
        // Inicializáljuk a szkennert
        const scanner = new Html5QrcodeScanner(
            "reader", 
            { fps: 10, qrbox: { width: 250, height: 250 } }, 
            false
        );

        // Mit csináljon, ha sikeres a beolvasás
        scanner.render(
            (decodedText) => {
                scanner.clear(); // Leállítjuk a kamerát a sikeres olvasás után
                onScanSuccess(decodedText); // Visszaadjuk az adatot a szülő komponensnek
            },
            (errorMessage) => {
                // A folyamatos olvasási hibákat (pl. nem lát QR kódot) itt ignoráljuk, különben telespammeli a konzolt
            }
        );

        // Amikor bezárjuk az ablakot, takarítunk (kamera leállítása)
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