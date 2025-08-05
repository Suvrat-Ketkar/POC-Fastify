const API_URL = "http://localhost:3000/notes";

async function fetchNotes() {
  const res = await fetch(API_URL);
  return res.json();
}

async function addNote(text) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  return res.json();
}

async function addNotesBulk(notes) {
  const res = await fetch(`${API_URL}/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes })
  });
  return res.json();
}

async function deleteNote(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

async function deleteNotesBulk(ids) {
  const res = await fetch(`${API_URL}/bulk`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids })
  });
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

window.onload = loadNotes;
