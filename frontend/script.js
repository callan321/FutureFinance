import { encryptMessage, decryptMessage } from './encryption.js';

async function handleEncryptMessage() {
    const senderElement = document.getElementById('sender');
    const receiverElement = document.getElementById('receiver');
    const plaintextElement = document.getElementById('plaintext');
    const encryptedTextElement = document.getElementById('encryptedText');
    const ivElement = document.getElementById('iv');
    const decryptedTextElement = document.getElementById('decryptedText');
    const resultsElement = document.getElementById('results');
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    if (!senderElement || !receiverElement || !plaintextElement || !encryptedTextElement || !ivElement || !decryptedTextElement || !resultsElement) {
        console.error('One or more elements are missing in the DOM');
        return;
    }

    const sender = senderElement.value.trim();
    const receiver = receiverElement.value.trim();
    const plaintext = plaintextElement.value.trim();

    if (!sender || !receiver || !plaintext) {
        alert("Please fill out all fields.");
        return;
    }

    const { encrypted, iv } = await encryptMessage(plaintext);

    encryptedTextElement.textContent = encrypted;
    ivElement.textContent = iv;

    // Send encrypted message and IV to the server
    const response = await fetch('/api/messages/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken  // Include CSRF token in the request
        },
        body: JSON.stringify({
            sender: sender,
            receiver: receiver,
            content: encrypted,
            iv: iv
        })
    });

    if (response.ok) {
        console.log('Message sent successfully');
    } else {
        console.error('Failed to send message');
    }

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

async function getAllMessages() {
    const senderElement = document.getElementById('sender');
    const messagesListElement = document.getElementById('messagesList');
    const allMessagesElement = document.getElementById('allMessages');

    if (!senderElement || !messagesListElement || !allMessagesElement) {
        console.error('One or more elements are missing in the DOM');
        return;
    }

    const sender = senderElement.options[senderElement.selectedIndex].text;
    if (!sender) {
        alert("Please select a sender.");
        return;
    }

    try {
        const response = await fetch(`/api/users/${sender}/messages/`);
        if (response.ok) {
            const messages = await response.json();
            messagesListElement.innerHTML = '';
            for (const message of messages) {
                const listItem = document.createElement('li');
                try {
                    const decryptedContent = await decryptMessage(message.content, message.iv);
                    listItem.innerHTML = `To: ${message.receiver} - Encrypted: ${message.content}<br>Decrypted: ${decryptedContent}`;

                } catch (decryptionError) {
                    console.error('Error decrypting message:', decryptionError);
                    listItem.textContent = `To: ${message.receiver} - Error decrypting message`;
                }
                messagesListElement.appendChild(listItem);
            }
            allMessagesElement.style.display = 'block';
        } else {
            console.error('Failed to fetch messages:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching or decrypting messages:', error);
    }
}

// Ensure the functions are available to be called from the HTML
window.encryptMessage = handleEncryptMessage;
window.decryptMessage = handleDecryptMessage;
window.getAllMessages = getAllMessages;
