// @ts-ignore
const qrcode = require('qrcode-generator');

export class QrUtil {
    public static async showQRCodeUntilClose(data: string) {
        return new Promise<void>((resolve) => {
            const qr = qrcode(0, 'L');
            qr.addData(data);
            qr.make();

            const dataUrl = qr.createDataURL(8); // Pixelgröße

            const overlay = document.createElement('div');
            overlay.id = "qr-popup";
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '10000';

            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
            container.style.backgroundColor = 'white';
            container.style.padding = '30px';
            container.style.borderRadius = '20px';
            container.style.boxShadow = '0 0 30px rgba(0,0,0,0.8)';
            container.style.gap = '15px';

            const img = document.createElement('img');
            img.src = dataUrl;
            img.style.borderRadius = '10px';

            const copyButton = document.createElement('button');
            copyButton.textContent = '📋 Kopieren';
            copyButton.style.fontSize = '18px';
            copyButton.style.padding = '10px 20px';
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '10px';
            copyButton.style.backgroundColor = '#4CAF50';
            copyButton.style.color = 'white';
            copyButton.style.cursor = 'pointer';
            copyButton.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            copyButton.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(data);
                    copyButton.textContent = '✔️ Kopiert!';
                    setTimeout(() => copyButton.textContent = '📋 Kopieren', 2000);
                } catch (err) {
                    alert('Kopieren fehlgeschlagen: ' + err);
                }
            };

            const closeButton = document.createElement('button');
            closeButton.textContent = '✖ Schließen';
            closeButton.style.fontSize = '18px';
            closeButton.style.padding = '10px 20px';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '10px';
            closeButton.style.backgroundColor = '#ff4d4d';
            closeButton.style.color = 'white';
            closeButton.style.cursor = 'pointer';
            closeButton.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            closeButton.onclick = () => {
                document.body.removeChild(overlay);
                resolve(); // <-- Hier wird das Promise aufgelöst!
            };

            container.appendChild(img);
            container.appendChild(copyButton);
            container.appendChild(closeButton);
            overlay.appendChild(container);
            document.body.appendChild(overlay);
        });
    }

}
