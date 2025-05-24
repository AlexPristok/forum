// ============ Message Card Generator ============
function createMessageCard(content, author, timestamp = null) {
  const card = document.createElement('div');
  card.className = 'post-box mb-3';
  card.style.backgroundColor = '#dec68d';
  card.style.padding = '15px';
  card.style.borderRadius = '5px';

  const title = document.createElement('div');
  title.style.fontSize = '18px';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '10px';
  title.textContent = content;

  const footer = document.createElement('div');
  footer.className = 'post-meta';
  footer.style.display = 'flex';
  footer.style.justifyContent = 'space-between';
  footer.style.fontSize = '12px';
  const dateText = timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleDateString();
  footer.innerHTML = `<span>Posted by: ${author}</span><span>on: ${dateText}</span>`;

  card.appendChild(title);
  card.appendChild(footer);
  return card;
}

// ============ Add User Message ============
function submitUserPopupMessage() {
  const input = document.getElementById('userMessageInput');
  const usernameInput = document.getElementById('modalUsernameInput');
  const content = input.value.trim();
  const author = usernameInput.value.trim() || "Anonymous";

  if (!content) {
    alert("Enter something!");
    return;
  }

  fetch('submit_user_message.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `content=${encodeURIComponent(content)}&author=${encodeURIComponent(author)}`
  })
  .then(res => res.text())
  .then(() => {
    // reload messages after post
    loadUserMessages();
    input.value = '';
    usernameInput.value = '';
    const modal = bootstrap.Modal.getInstance(document.getElementById('userMessageModal'));
    modal.hide();
  });
}

// ============ Add Washing Entry ============
function addWashingEntry() {
  const time = document.getElementById('timeInput').value;
  const name = document.getElementById('nameInput').value.trim();
  const room = document.getElementById('roomInput').value.trim();

  if (!time || !name || !room) {
    alert('Please fill all fields!');
    return;
  }

  fetch('submit_washing.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `time=${encodeURIComponent(time)}&name=${encodeURIComponent(name)}&room=${encodeURIComponent(room)}`
  })
  .then(res => res.text())
  .then(response => {
    if (response.includes("already booked")) {
      alert("❌ That time slot is already taken!");
    } else if (response.includes("saved")) {
      loadWashingEntries(); // reload after insert
      document.getElementById('timeInput').selectedIndex = 0;
      document.getElementById('nameInput').value = '';
      document.getElementById('roomInput').value = '';
    } else {
      alert("Unexpected response: " + response);
    }
  })
  .catch(err => console.error("Error:", err));
}

// ============ Load User Messages ============
function loadUserMessages() {
  fetch('load_user_messages.php')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('people-section');
      container.innerHTML = '';
      data.forEach(msg => {
        const card = createMessageCard(msg.content, msg.author, msg.created_at);
        container.appendChild(card);
      });
    })
    .catch(err => console.error('Error loading user messages:', err));

    window.addEventListener("DOMContentLoaded", () => {
  fetch('load_user_messages.php')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('people-section');
      container.innerHTML = '';
      data.forEach(msg => {
        const card = createMessageCard(msg.content, msg.author, msg.created_at);
        container.appendChild(card);
      });
    })
    .catch(err => console.error('Error loading user messages:', err));
});

}

// ============ Load Washing Machine ============
function loadWashingEntries() {
  fetch('load_washing.php')
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById('washing-table').getElementsByTagName('tbody')[0];
      table.innerHTML = '';
      data.forEach(entry => {
        const row = table.insertRow();
        row.insertCell(0).innerText = entry.time_slot;
        row.insertCell(1).innerText = entry.name;
        row.insertCell(2).innerText = entry.room;
      });
    })
    .catch(err => console.error('Error loading washing entries:', err));
}

// ============ Initial Load ============
window.addEventListener("DOMContentLoaded", () => {
  loadUserMessages();
  loadWashingEntries();
});
