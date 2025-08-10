
import { getNotes, addNote, deleteNote, addNotesBulk, deleteNotesBulk } from './notes-app.controller.js';

export default async function (fastify, opts) {
  // Register authenticate hook for all routes in this plugin
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.post('/notes/bulk', addNotesBulk);
  fastify.delete('/notes/bulk', deleteNotesBulk);
  fastify.get('/notes', getNotes);
  fastify.post('/notes', addNote);
  fastify.delete('/notes/:id', deleteNote);
}
