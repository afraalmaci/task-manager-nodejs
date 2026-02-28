const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getNotes, createNote } = require('../controllers/noteController');

router.use(protect);

router.get('/', getNotes);
router.post('/', createNote);

module.exports = router;