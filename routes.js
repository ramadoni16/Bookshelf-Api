const { tambahBuku, getAllBuku, getByIdBuku, editBukuById, deleteById } = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: tambahBuku,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBuku,
  },
  {
    method: "GET",
    path: "/books/{id}",
    handler: getByIdBuku,
  },
  {
    method: "PUT",
    path: "/books/{id}",
    handler: editBukuById,
  },
  {
    method: "DELETE",
    path: "/books/{id}",
    handler: deleteById,
  },
];

module.exports = routes;
