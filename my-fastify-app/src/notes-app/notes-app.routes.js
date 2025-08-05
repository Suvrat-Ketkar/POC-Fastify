
import { getNotes, addNote, deleteNote, addNotesBulk, deleteNotesBulk } from './notes-app.controller.js';

export const registerNoteRoutes = (app) => {
  app.get('/notes', getNotes);
  app.post('/notes', addNote);
  app.delete('/notes/:id', deleteNote);
  app.post('/notes/bulk', addNotesBulk);
  app.delete('/notes/bulk', deleteNotesBulk);
};
