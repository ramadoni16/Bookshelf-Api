const { nanoid } = require("nanoid");
// console.log(nanoid(16));
const book = require("./book");

// INI UNTUK TAMBAH BUKU
const tambahBuku = (request, handle) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (name === undefined) {
    const response = handle.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);

    return response;
  }

  if (pageCount < readPage) {
    const response = handle.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  book.push(newBook);

  const isSuccess = book.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = handle.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }

  const response = handle.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);

  return response;
};

// INI UNTUK MENAMPILKAN SEMUA BUKU
const getAllBuku = async (request, handle) => {
  const { name, reading, finished } = request.query;

  let filterBuku = book;

  if (name !== undefined) {
    filterBuku = filterBuku.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filterBuku = filterBuku.filter((book) => book.reading === true);
  }

  if (finished !== undefined) {
    filterBuku = filterBuku.filter((book) => book.finished === false);
  }

  const response = handle.response({
    status: "success",
    data: {
      books: filterBuku.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);

  return response;
};

// INI UNTUK MENGAMBIL DATA BUKU BERDASARKAN ID
const getByIdBuku = (request, handle) => {
  const { id } = request.params;
  const books = book.filter((b) => b.id === id)[0];

  if (books !== undefined) {
    return {
      status: "success",
      data: {
        books,
      },
    };
  }

  const response = handle.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);

  return response;
};

// INI FUNGSI UNTUK EDIT BERDASARKAN ID
const editBukuById = async (request, handle) => {
  const { id } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updateAt = new Date().toISOString();
  const index = book.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (name === undefined) {
      const response = handle.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);

      return response;
    }
    if (readPage > pageCount) {
      const response = handle.response({
        status: "fail",
        message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);

      return response;
    }
    const finished = pageCount === readPage;

    book[index] = {
      ...book[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      readPage,
      updateAt,
    };

    const response = handle.response({
      status: "success",
      message: "Buku berahasil diperbarui",
    });
    response.code(200);

    return response;
  }
  const response = handle.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);

  return response;
};

const deleteById = async (request, handle) => {
  const { id } = request.params;

  const index = book.findIndex((note) => note.id === id);

  if (index !== -1) {
    book.splice(index, 1);
    const response = handle.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);

    return response;
  }
  const response = handle.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);

  return response;
};

module.exports = {
  tambahBuku,
  getAllBuku,
  getByIdBuku,
  editBukuById,
  deleteById,
};
