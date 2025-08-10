const API_URL = "http://localhost:3000";

// Auth Functions
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    handleSuccessfulLogin(data.token);
  } catch (error) {
    showError(error.message);
  }
}

function handleSuccessfulLogin(token) {
  localStorage.setItem('token', token);
  showApp();
  loadNotes();
}

async function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    showError('Passwords do not match');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    showApp();
    await loadNotes();
  } catch (error) {
    showError(error.message);
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  showAuth();
}

// UI Helper Functions
function showAuth() {
  document.getElementById('authContainer').classList.remove('hidden');
  document.getElementById('appContainer').classList.add('hidden');
}

function showApp() {
  document.getElementById('authContainer').classList.add('hidden');
  document.getElementById('appContainer').classList.remove('hidden');
}

function toggleAuthForm() {
  document.getElementById('loginForm').classList.toggle('hidden');
  document.getElementById('registerForm').classList.toggle('hidden');
}

function showError(message) {
  const toast = document.getElementById('errorToast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    showApp();
    loadNotes();
  } else {
    showAuth();
  }
});

// API Functions with Authentication
async function fetchNotes() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/notes`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    if (res.status === 401) {
      handleLogout();
      throw new Error('Please login again');
    }
    throw new Error('Failed to fetch notes');
  }
  return res.json();
}

async function addNote(text) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  if (!res.ok) {
    if (res.status === 401) {
      handleLogout();
      throw new Error('Please login again');
    }
    throw new Error('Failed to add note');
  }
  return res.json();
}

async function addNotesBulk(notes) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/notes/bulk`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ notes })
  });
  if (!res.ok) {
    if (res.status === 401) {
      handleLogout();
      throw new Error('Please login again');
    }
    throw new Error('Failed to add notes');
  }
  return res.json();
}

async function deleteNote(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/notes/${id}`, { 
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) {
    if (res.status === 401) {
      handleLogout();
      throw new Error('Please login again');
    }
    throw new Error('Failed to delete note');
  }
}

async function deleteNotesBulk(ids) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/notes/bulk`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ ids })
  });
  if (!res.ok) {
    if (res.status === 401) {
      handleLogout();
      throw new Error('Please login again');
    }
    throw new Error('Failed to delete notes');
  }
  return res.json();
}

function renderNotes(notes) {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";
  
  notes.forEach(note => {
    const li = document.createElement("li");
    li.className = "note-item";
    
    // Checkbox for bulk selection
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "note-checkbox";
    checkbox.value = note.id;
    checkbox.onchange = updateDeleteButton;
    
    // Note text
    const noteText = document.createElement("span");
    noteText.className = "note-text";
    noteText.textContent = note.text;
    
    // Individual delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = async () => {
      await deleteNote(note.id);
      loadNotes();
    };
    
    li.appendChild(checkbox);
    li.appendChild(noteText);
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });
  
  // Update the select all checkbox state
  updateSelectAllState();
}

function updateDeleteButton() {
  const checkboxes = document.querySelectorAll('.note-checkbox:checked');
  const deleteBtn = document.getElementById('deleteSelectedBtn');
  deleteBtn.disabled = checkboxes.length === 0;
}

function updateSelectAllState() {
  const allCheckboxes = document.querySelectorAll('.note-checkbox');
  const checkedCheckboxes = document.querySelectorAll('.note-checkbox:checked');
  const selectAllCheckbox = document.getElementById('selectAll');
  
  if (allCheckboxes.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (checkedCheckboxes.length === allCheckboxes.length) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else if (checkedCheckboxes.length > 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  }
}

async function loadNotes() {
  const notes = await fetchNotes();
  renderNotes(notes);
}

// Single note form submission
document.getElementById("noteForm").onsubmit = async (e) => {
  e.preventDefault();
  const input = document.getElementById("noteInput");
  if (input.value.trim()) {
    await addNote(input.value.trim());
    input.value = "";
    loadNotes();
  }
};

// Bulk note form submission
document.getElementById("bulkNoteForm").onsubmit = async (e) => {
  e.preventDefault();
  const textarea = document.getElementById("bulkNoteInput");
  const lines = textarea.value.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  if (lines.length > 0) {
    const notes = lines.map(text => ({ text }));
    await addNotesBulk(notes);
    textarea.value = "";
    loadNotes();
  }
};

// Select all checkbox handler
document.getElementById("selectAll").onchange = (e) => {
  const checkboxes = document.querySelectorAll('.note-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.checked = e.target.checked;
  });
  updateDeleteButton();
};

// Delete selected notes handler
document.getElementById("deleteSelectedBtn").onclick = async () => {
  const selectedIds = Array.from(document.querySelectorAll('.note-checkbox:checked'))
    .map(checkbox => parseInt(checkbox.value));
  
  if (selectedIds.length > 0) {
    await deleteNotesBulk(selectedIds);
    loadNotes();
  }
};

// Check authentication and load notes if user is logged in
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    showApp();
    loadNotes();
  } else {
    showAuth();
  }
});
