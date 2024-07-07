document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    document.getElementById('generate-btn').addEventListener('click', () => {
        let data;
        const activeTab = document.querySelector('.tab-content.active').id;
        switch (activeTab) {
            case 'url-tab':
                data = document.getElementById('url-input').value;
                break;
            case 'pdf-tab':
                data = document.getElementById('pdf-input').value;
                break;
            case 'app-tab':
                data = document.getElementById('app-input').value;
                break;
            case 'sms-tab':
                data = `SMSTO:${document.getElementById('sms-input').value}`;
                break;
            case 'phone-tab':
                data = `tel:${document.getElementById('phone-input').value}`;
                break;
            case 'email-tab':
                data = `mailto:${document.getElementById('email-input').value}`;
                break;
            case 'contact-tab':
                const name = document.getElementById('contact-name').value;
                const phone = document.getElementById('contact-phone').value;
                data = `MECARD:N:${name};TEL:${phone};;`;
                break;
            case 'multiurl-tab':
                data = document.getElementById('multiurl-input').value.split('\n').join('\n');
                break;
            case 'text-tab':
                data = document.getElementById('text-input').value;
                break;
            default:
                alert('Please enter some data to generate QR code');
                return;
        }

        if (data) {
            fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data })
            })
            .then(response => response.json())
            .then(data => {
                const qrCodeDiv = document.getElementById('qr-code');
                qrCodeDiv.innerHTML = `<img src="${data.qrCodeUrl}" alt="QR Code" id="qr-image">`;
                document.getElementById('qr-actions').style.display = 'block';
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Please enter some data to generate QR code');
        }
    });

    document.getElementById('download-btn').addEventListener('click', () => {
        const qrImage = document.getElementById('qr-image');
        if (qrImage) {
            const format = document.getElementById('format-select').value;
            const link = document.createElement('a');
            link.href = qrImage.src;
            link.download = `qr-code.${format}`;
            link.click();
        }
    });

    document.getElementById('copy-link-btn').addEventListener('click', () => {
        const qrImage = document.getElementById('qr-image');
        if (qrImage) {
            navigator.clipboard.writeText(qrImage.src)
                .then(() => alert('QR code link copied to clipboard'))
                .catch(error => console.error('Error copying QR code link:', error));
        }
    });
});


