// Import fungsi handler untuk menyimpan catatannya dan ganti hendlernya.
const { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler } = require("./handler");

const routes = [
  // Route Untuk Menyimpan Catatan
  {
    method: "POST",
    path: "/notes",
    handler: addNoteHandler,
  },

  // Route untuk menampilkan Catatan
  {
    method: "GET",
    path: "/notes",
    handler: getAllNotesHandler,
  },

  // Route untuk menampilkan Detail Catatan
  {
    method: "GET",
    path: "/notes/{id}",
    handler: getNoteByIdHandler,
  },

  // Route untuk Mengubah Catatan
  {
    method: "PUT",
    path: "/notes/{id}",
    handler: editNoteByIdHandler,
  },

  // Route untuk menghapus catatan
  {
    method: "DELETE",
    path: "/notes/{id}",
    handler: deleteNoteByIdHandler,
  },
];

module.exports = routes;
