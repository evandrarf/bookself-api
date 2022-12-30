import {
  storeBooks,
  getBooks,
  getDetailBook,
  updateBookData,
  deleteBook,
} from "./handler.js";

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: storeBooks,
  },
  {
    method: "GET",
    path: "/books",
    handler: getBooks,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getDetailBook,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: updateBookData,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBook,
  },
];

export default routes;
