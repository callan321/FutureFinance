import { encryptMessage, decryptMessage } from './encryption.js';

async function handleEncryptMessage() {
    const plaintextElement = document.getElementById('plaintext');
    const encryptedTextElement = document.getElementById('encryptedText');
    const ivElement = document.getElementById('iv');
    const decryptedTextElement = document.getElementById('decryptedText');
    const resultsElement = document.getElementById('results');

    if (!plaintextElement || !encryptedTextElement || !ivElement || !decryptedTextElement || !resultsElement) {
        console.error('One or more elements are missing in the DOM');
        return;
    }

    const plaintext = plaintextElement.value.trim();

    if (!plaintext) {
        alert("Please enter a message to encrypt.");
        return;
    }

    const { encrypted, iv } = await encryptMessage(plaintext);

    encryptedTextElement.textContent = encrypted;
    ivElement.textContent = iv;

    const decryptedText = await decryptMessage(encrypted, iv);
    decryptedTextElement.textContent = decryptedText;

    resultsElement.style.display = 'block';
}

async function handleDecryptMessage() {
    const encryptedTextElement = document.getElementById('encryptedText');
    const ivElement = document.getElementById('iv');
    const decryptedTextElement = document.getElementById('decryptedText');
    const decryptedSectionElement = document.getElementById('decryptedSection');

    if (!encryptedTextElement || !ivElement || !decryptedTextElement || !decryptedSectionElement) {
        console.error('One or more elements are missing in the DOM');
        return;
    }

    const encryptedHex = encryptedTextElement.textContent.trim();
    const ivHex = ivElement.textContent.trim();

    if (!encryptedHex || !ivHex) {
        alert("Please encrypt a message first.");
        return;
    }

    const plaintext = await decryptMessage(encryptedHex, ivHex);
    decryptedTextElement.textContent = plaintext;
    decryptedSectionElement.style.display = 'block';
}

// Ensure the functions are available to be called from the HTML
window.encryptMessage = handleEncryptMessage;
window.decryptMessage = handleDecryptMessage;
