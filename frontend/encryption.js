let key;
let iv; // Store the IV here

async function fetchKey() {
    const response = await fetch('/static/encryption_key.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const keyData = await response.json();
    key = hexToBytes(keyData.key);
}

export async function encryptMessage(plaintext) {
    if (!key) await fetchKey();
    iv = generateIV(); // Generate a new IV for each encryption
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const encrypted = await encryptAES(data, key, iv);
    return { encrypted: bytesToHex(encrypted), iv: bytesToHex(iv) };
}

export async function decryptMessage(encryptedHex, ivHex) {
    if (!key) await fetchKey();
    const encrypted = hexToBytes(encryptedHex);
    const iv = hexToBytes(ivHex);

    const decrypted = await decryptAES(encrypted, key, iv);
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

function generateIV() {
    return crypto.getRandomValues(new Uint8Array(16));  // Generate random 16-byte IV
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
