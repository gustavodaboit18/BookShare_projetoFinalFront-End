const express = require("express");
const booksController = require('../controllers/booksController');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get("/", booksController.listBooks);
router.get("/user/:userId", booksController.getBooksByUser);
router.get("/:id", booksController.getBook);
router.post("/", protect, booksController.createBook);
router.put("/:id", protect, booksController.updateBook);
router.delete("/:id", protect, booksController.deleteBook);

module.exports = router;
