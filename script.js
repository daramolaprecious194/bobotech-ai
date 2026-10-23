function openPasswordModal() {
    document.getElementById('passwordModal').classList.remove('hidden');
    document.getElementById('ownerPasswordInput').value = '';
    document.getElementById('passwordStatus').innerText = "Enter password to unlock API settings.";
    document.getElementById('passwordStatus').style.color = "#94a3b8";
}

function closePasswordModal() {
    document.getElementById('passwordModal').classList.add('hidden');
}

function checkPassword() {
    var typed = document.getElementById('ownerPasswordInput').value.trim().toUpperCase();
    if (typed === "310AA") {
        document.getElementById('passwordStatus').innerText = "Success!";
        document.getElementById('passwordStatus').style.color = "#10b981";
        setTimeout(function() {
            closePasswordModal();
        }, 500);
    } else {
        document.getElementById('passwordStatus').innerText = "Incorrect! You typed: " + typed;
        document.getElementById('passwordStatus').style.color = "#ef4444";
    }
}

function createNewChat() {
    document.getElementById('chat-messages').innerHTML = 
        '<div class="message-row ai"><div class="msg-avatar ai-avatar">B</div><div class="ai-content"><div class="message-bubble"><p>New chat started. How can I help you?</p></div></div></div>';
    var box = document.getElementById('chatHistoryBox');
    var newItem = document.createElement('button');
    newItem.className = 'chat-history-item active';
    newItem.innerText = 'New Chat Session...';
    var items = box.querySelectorAll('.chat-history-item');
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
    box.insertBefore(newItem, box.firstChild);
}

function handleEnter(e) {
    if (e.key === 'Enter') { sendMessage(); }
}

async function sendMessage() {
    var inputField = document.getElementById('userInput');
    var text = inputField.value.trim();
    if (text === '') return;

    var chatBox = document.getElementById('chat-messages');
    var userRow = document.createElement('div');
    userRow.className = 'message-row user';
    userRow.innerHTML = '<div class="message-bubble">' + text + '</div>';
    chatBox.appendChild(userRow);
    inputField.value = '';

    var loadingRow = document.createElement('div');
    loadingRow.className = 'message-row ai';
    loadingRow.innerHTML = '<div class="msg-avatar ai-avatar">B</div><div class="ai-content"><div class="message-bubble"><p>Thinking...</p></div></div>';
    chatBox.appendChild(loadingRow);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        chatBox.removeChild(loadingRow);

        if (data.reply) {
            var aiRow = document.createElement('div');
            aiRow.className = 'message-row ai';
            aiRow.innerHTML = '<div class="msg-avatar ai-avatar">B</div><div class="ai-content"><div class="message-bubble"><p>' + data.reply + '</p></div></div>';
            chatBox.appendChild(aiRow);
        } else {
            var errRow = document.createElement('div');
            errRow.className = 'message-row ai';
            errRow.innerHTML = '<div class="msg-avatar ai-avatar">B</div><div class="ai-content"><div class="message-bubble"><p>Error: Could not get a response.</p></div></div>';
            chatBox.appendChild(errRow);
        }
    } catch (error) {
        chatBox.removeChild(loadingRow);
        var errRow = document.createElement('div');
        errRow.className = 'message-row ai';
        errRow.innerHTML = '<div class="msg-avatar ai-avatar">B</div><div class="ai-content"><div class="message-bubble"><p>Error connecting to backend. Is the server running?</p></div></div>';
        chatBox.appendChild(errRow);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}
