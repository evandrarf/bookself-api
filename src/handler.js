import { nanoid } from "nanoid";
import bookself from "./bookself.js";

const storeBooks = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = false;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  bookself.push(newBook);

  const isSuccess = bookself.filter((book) => book.id == newBook.id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: newBook.id,
      },
    });

    response.code(201);
    return response;
  }
  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });

  response.code(500);
  return response;
};

const getBooks = (request, h) => {
  const nameQuery = new RegExp(request.query.name, "i");
  const { reading, finished } = request.query;

  if (reading) {
    const response = h.response({
      status: "success",
      data: {
        books: bookself
          .filter((book) => book.reading == reading)
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    const response = h.response({
      status: "success",
      data: {
        books: bookself
          .filter((book) => book.finished == finished)
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
      },
    });
    response.code(200);
    return response;
  }

  if (nameQuery) {
    const response = h.response({
      status: "success",
      data: {
        books: bookself
          .filter((book) => nameQuery.test(book.name))
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      books: bookself.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);

  return response;
};

const getDetailBook = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = bookself.findIndex((book) => book.id == bookId);

  if (bookIndex < 0) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const book = bookself[bookIndex];

  const response = h.response({
    status: "success",
    data: {
      book: {
        id: book.id,
        name: book.name,
        year: book.year,
        author: book.author,
        summary: book.summary,
        publisher: book.publisher,
        pageCount: book.pageCount,
        readPage: book.readPage,
        finished: book.finished,
        reading: book.reading,
        insertedAt: book.insertedAt,
        updatedAt: book.updatedAt,
      },
    },
  });

  response.code(200);

  return response;
};

const updateBookData = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });

    response.code(400);
    return response;
  }

  const bookIndex = bookself.findIndex((book) => book.id == bookId);

  if (bookIndex < 0) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  bookself[bookIndex] = {
    ...bookself[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = bookself.findIndex((book) => book.id == bookId);

  if (bookIndex < 0) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  bookself.splice(bookIndex, 1);
  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};

export { storeBooks, getBooks, getDetailBook, updateBookData, deleteBook };
