
// Controller functions for notes API
export const getNotes = async (request, reply) => {
  const notes = await request.server.prisma.note.findMany({
    where: {
      userId: request.user.userId
    }
  });
  return notes;
};

export const addNote = async (request, reply) => {
  const { text } = request.body;
  const note = await request.server.prisma.note.create({ 
    data: { 
      text,
      userId: request.user.userId
    } 
  });
  reply.code(201).send(note);
};

export const deleteNote = async (request, reply) => {
  const { id } = request.params;
  
  // Verify the note belongs to the user
  const note = await request.server.prisma.note.findUnique({
    where: { id: Number(id) }
  });

  if (!note || note.userId !== request.user.userId) {
    reply.code(403).send({ error: 'Not authorized to delete this note' });
    return;
  }

  await request.server.prisma.note.delete({ where: { id: Number(id) } });
  reply.code(204).send();
};

// Bulk create notes
export const addNotesBulk = async (request, reply) => {
  const { notes } = request.body; // expects: { notes: [{ text: "..." }, ...] }
  if (!Array.isArray(notes) || notes.length === 0) {
    return reply.code(400).send({ error: 'notes must be a non-empty array' });
  }
  const userId = request.user.userId;
  const notesWithUserId = notes.map(note => ({ ...note, userId }));
  const created = await request.server.prisma.note.createMany({ data: notesWithUserId });
  reply.code(201).send(created);
};

// Bulk delete notes
export const deleteNotesBulk = async (request, reply) => {
  const { ids } = request.body; // expects: { ids: [1, 2, ...] }
  if (!Array.isArray(ids) || ids.length === 0) {
    return reply.code(400).send({ error: 'ids must be a non-empty array' });
  }
  const deleted = await request.server.prisma.note.deleteMany({ where: { id: { in: ids.map(Number) } } });
  reply.code(200).send(deleted);
};
