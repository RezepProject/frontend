// @ts-ignore
const qrcode = require('qrcode-generator');

export class QrUtil {
    public static showPopup(data: string) {
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

        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.padding = '20px';
        img.style.backgroundColor = 'white';
        img.style.borderRadius = '20px';
        img.style.boxShadow = '0 0 30px rgba(0,0,0,0.8)';
        img.style.marginBottom = '20px';

        const closeButton = document.createElement('button');
        closeButton.textContent = '✖ Schließen';
        closeButton.style.fontSize = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '10px';
        closeButton.style.backgroundColor = '#ff4d4d';
        closeButton.style.color = 'white';
        closeButton.style.cursor = 'pointer';
        closeButton.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        closeButton.onclick = () => {
            window.localStorage.removeItem('qrCode')
            location.reload();
        };

        overlay.appendChild(img);
        overlay.appendChild(closeButton);
        document.body.appendChild(overlay);
    }
}
