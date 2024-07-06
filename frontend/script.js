let key;
let iv;

async function encryptMessage() {
    const plaintext = document.getElementById('plaintext').value.trim(); // Get plaintext from textarea

    if (!plaintext) {
        alert("Please enter a message to encrypt.");
        return;
    }

    // Generate random 256-bit key
    key = crypto.getRandomValues(new Uint8Array(32));

    // Convert plaintext to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Generate random 16-byte IV
    iv = crypto.getRandomValues(new Uint8Array(16));

    // Encrypt using AES-CBC with PKCS7 padding
    const encrypted = await encryptAES(data, key, iv);

    // Display encrypted message
    const encryptedHex = bytesToHex(encrypted);
    document.getElementById('encryptedText').textContent = encryptedHex;

    // Decrypt and display decrypted message
    const decrypted = await decryptAES(encrypted, key, iv);
    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decrypted);
    document.getElementById('decryptedText').textContent = decryptedText;

    // Show results section
    document.getElementById('results').style.display = 'block';
}

async function decryptMessage() {
    const encryptedHex = document.getElementById('encryptedText').textContent.trim();

    if (!encryptedHex) {
        alert("Please encrypt a message first.");
        return;
    }

    if (!key || !iv) {
        alert("Encryption key or IV not found. Encrypt a message first.");
        return;
    }

    // Convert encrypted message from hex string to Uint8Array
    const encrypted = hexToBytes(encryptedHex);

    // Decrypt using AES-CBC with PKCS7 padding
    const decrypted = await decryptAES(encrypted, key, iv);

    // Convert decrypted Uint8Array to string
    const decoder = new TextDecoder();
    const plaintext = decoder.decode(decrypted);

    // Display decrypted message
    document.getElementById('decryptedText').textContent = plaintext;

    // Show decrypted section (in case it was hidden)
    document.getElementById('decryptedSection').style.display = 'block';
}

async function encryptAES(data, key, iv) {
    const algorithm = { name: 'AES-CBC', iv: iv };
    const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['encrypt']);
    const encrypted = await crypto.subtle.encrypt(algorithm, cryptoKey, data);
    return new Uint8Array(encrypted);
}

async function decryptAES(encrypted, key, iv) {
    const algorithm = { name: 'AES-CBC', iv: iv };
    const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['decrypt']);
    const decrypted = await crypto.subtle.decrypt(algorithm, cryptoKey, encrypted);
    return new Uint8Array(decrypted);
}

function bytesToHex(bytes) {
    return Array.prototype.map.call(bytes, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

function hexToBytes(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
}
