const express = require("express");
const { listBooks, createBook } = require("../controllers/booksController");

const router = express.Router();

router.get("/", listBooks);
router.post("/", createBook);

module.exports = router;
