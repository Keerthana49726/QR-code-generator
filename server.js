const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/generate', (req, res) => {
    const data = req.body.data;
    QRCode.toDataURL(data, (err, url) => {
        if (err) {
            res.status(500).json({ error: 'Failed to generate QR code' });
        } else {
            res.json({ qrCodeUrl: url });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
