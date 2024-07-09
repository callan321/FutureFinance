import { encryptMessage, decryptMessage } from "./encryption.js";

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/users/");
  const users = await response.json();
  const senderSelect = document.getElementById("sender");
  const receiverSelect = document.getElementById("receiver");

  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.username; // Use username instead of id
    option.textContent = user.username;
    senderSelect.appendChild(option.cloneNode(true));
    receiverSelect.appendChild(option);
  });
});

async function handleEncryptMessage() {
  const senderElement = document.getElementById("sender");
  const receiverElement = document.getElementById("receiver");
  const plaintextElement = document.getElementById("plaintext");
  const encryptedTextElement = document.getElementById("encryptedText");
  const ivElement = document.getElementById("iv");
  const decryptedTextElement = document.getElementById("decryptedText");
  const decryptedSectionElement = document.getElementById("decryptedSection");
  const resultsElement = document.getElementById("results");
  const csrfToken = document.querySelector(
    'input[name="csrfmiddlewaretoken"]'
  ).value;

  if (
    !senderElement ||
    !receiverElement ||
    !plaintextElement ||
    !encryptedTextElement ||
    !ivElement ||
    !decryptedTextElement ||
    !resultsElement
  ) {
    console.error("One or more elements are missing in the DOM");
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
  decryptedTextElement.textContent = plaintext;

  // Send encrypted message and IV to the server
  const response = await fetch("/api/messages/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // Include CSRF token in the request
    },
    body: JSON.stringify({
      sender: sender,
      receiver: receiver,
      content: encrypted,
      iv: iv,
    }),
  });

  if (response.ok) {
    console.log("Message sent successfully");
    plaintextElement.value = ""; // Clear the plaintext input box
    resultsElement.style.display = "block";
    decryptedSectionElement.style.display = "block"; // Ensure decrypted section is displayed
    getAllMessages(); // Refresh the message list
  } else {
    console.error("Failed to send message");
  }
}

async function getAllMessages() {
  const senderElement = document.getElementById("sender");
  const receiverElement = document.getElementById("receiver");
  const messagesListElement = document.getElementById("messagesList");
  const allMessagesElement = document.getElementById("allMessages");

  if (
    !senderElement ||
    !receiverElement ||
    !messagesListElement ||
    !allMessagesElement
  ) {
    console.error("One or more elements are missing in the DOM");
    return;
  }

  const sender = senderElement.value;
  const receiver = receiverElement.value;
  if (!sender || !receiver) {
    alert("Please select both sender and receiver.");
    return;
  }

  try {
    const response = await fetch(
      `/api/users/${sender}/messages/?other_username=${receiver}`
    );
    if (response.ok) {
      const messages = await response.json();
      messagesListElement.innerHTML = "";
      for (const message of messages) {
        const listItem = document.createElement("li");
        try {
          const decryptedContent = await decryptMessage(
            message.content,
            message.iv
          );
          const direction = message.sender === sender ? "You" : message.sender;
          listItem.innerHTML = `
            <strong style="font-size: 1.2em;">${direction}</strong><br>
            <strong>Encrypted:</strong> ${message.content} <br>
            <strong>Decrypted:</strong> ${decryptedContent}
          `;
        } catch (decryptionError) {
          console.error("Error decrypting message:", decryptionError);
          listItem.innerHTML = `
            <strong style="font-size: 1.2em;">${message.sender}</strong><br>
            <strong>Encrypted:</strong> ${message.content} <br>
            Error decrypting message
          `;
        }
        messagesListElement.appendChild(listItem);
      }
      allMessagesElement.style.display = "block";
    } else {
      console.error("Failed to fetch messages:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching or decrypting messages:", error);
  }
}

// Ensure the functions are available to be called from the HTML
window.encryptMessage = handleEncryptMessage;
window.getAllMessages = getAllMessages;
