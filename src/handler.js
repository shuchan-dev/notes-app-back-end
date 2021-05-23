// Library untuk membuat id unik dan acak
const { nanoid } = require("nanoid");
const notes = require("./notes.js");

// fungsi handler untuk route
const addNoteHandler = (request, h) => {
  // Client mengirim data catatan (title, tags, dan body) yang akan disimpan dalam bentuk JSON melalui body request. Masih ingatkan cara mendapatkan body request di Hapi? Yap! Menggunakan properti request.payload. Yuk mari kita ambil datanya.
  const { title, tags, body } = request.payload;

  //   Cara menggunakan nanoid
  const id = nanoid(16);

  // Selanjutnya properti createdAt dan updatedAt. Karena kasus sekarang adalah menambahkan catatan baru, maka nilai kedua properti tersebut seharusnya sama. Jadi, kita bisa secara mudah memberikan nilai new Date().toISOString();.
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  //  Masukan nilai-nilai tersebut ke dalam array notes menggunakan method push().
  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };
  notes.push(newNote);

  // menentukan apakah newNote sudah masuk ke dalam array. Memanfaatkan method filter() berdasarkan id catatan untuk mengetahuinya. Kurang lebih implementasinya seperti ini:
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  //   Kemudian, gunakan isSuccess untuk menentukan respons yang diberikan server. Jika isSuccess bernilai true, maka beri respons berhasil. Jika false, maka beri respons gagal.
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

// Mendapatkan seluruh catatan.
const getAllNotesHandler = () => ({
  status: "success",
  data: {
    notes,
  },
});
// Menampilkan detail note
const getNoteByIdHandler = (request, h) => {
  // Catatan yang diubah akan diterapkan sesuai dengan id yang digunakan pada route parameter.
  const { id } = request.params;

  // Setelah mendapatkan nilai id, dapatkan objek note dengan id tersebut dari objek array notes. Manfaatkan method array filter() untuk mendapatkan objeknya.
  const note = notes.filter((n) => n.id === id)[0];
  // Kita kembalikan fungsi handler dengan data beserta objek note di dalamnya. Namun sebelum itu, pastikan dulu objek note tidak bernilai undefined. Bila undefined, kembalikan dengan respons gagal.
  if (note !== undefined) {
    return {
      status: "success",
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Catatan tidak ditemukan",
  });
  response.code(404);
  return response;
};

// Client akan mengirimkan permintaan ke route ‘/notes/{id}’ dengan method ‘PUT’ dan membawa objek catatan terbaru pada body request
// Memperbarui Note
const editNoteByIdHandler = (request, h) => {
  // Catatan yang diubah akan diterapkan sesuai dengan id yang digunakan pada route parameter.
  const { id } = request.params;

  // Mendapatkan data notes terbaru yang dikirimkan oleh client melalui body request
  const { title, tags, body } = request.payload;

  // Selain itu, tentu kita perlu perbarui juga nilai dari properti updatedAt. Jadi, dapatkan nilai terbaru dengan menggunakan new Date().toISOString()
  const updatedAt = new Date().toISOString();

  // Setelah data terbaru siap, saatnya mengubah catatan lama dengan data terbaru. ubah dengan memanfaatkan indexing array(memakai cara lain juga boleh jika dirasa cara lain lebih simple). Pertama, dapatkan dulu index array pada objek catatan sesuai id yang ditentukan. Untuk melakukannya, gunakanlah method array findIndex().
  const index = notes.findIndex((note) => note.id === id);

  // Bila note dengan id yang dicari ditemukan, maka index akan bernilai array index dari objek catatan yang dicari. Namun bila tidak ditemukan, maka index bernilai -1. Jadi, kita bisa menentukan gagal atau tidaknya permintaan dari nilai index menggunakan if else.
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h.response({
      status: "success",
      message: "Catatan berhasil diperbarui",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui catatan. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

// Menghapus Note
const deleteNoteByIdHandler = (request, h) => {
  // Setelah itu, saatnya kita menuliskan logikanya. Sama seperti mengubah catatan. Kita akan memanfaatkan index untuk menghapus catatan. Pertama, kita dapatkan dulu nilai id yang dikirim melalui path parameters.
  const { id } = request.params;

  // dapatkan index dari object catatan sesuia dengan id
  const index = notes.findIndex((note) => note.id === id);

  // Lakukan pengecekan terhadap nilai index, pastikan nilainya tidak -1 bila hendak menghapus catatan. Nah, untuk menghapus data pada array berdasarkan index, gunakan method array splice().
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Catatan berhasil dihapus",
    });
    response.code(200);
    return response;
  }
  // jika index bernilai -1, maka kembalikan handler dengan respons gagal.
  const response = h.response({
    status: "fail",
    message: "Catatan gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};
// Gunakan objek literals yah. Ini bertujuan untuk memudahkan ekspor lebih dari satu nilai pada satu berkas JavaScript.
module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
