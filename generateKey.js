const fs = require('fs');
const crypto = require('crypto');

function generateKey() {
    const key = crypto.randomBytes(32);
    const keyHex = key.toString('hex');

    const keyData = JSON.stringify({ key: keyHex }, null, 2);

    fs.writeFileSync('static/encryption_key.json', keyData, 'utf8');
    console.log('Encryption key generated and saved to static/encryption_key.json');
}

generateKey();
