const Note = require('../models/Note');

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.findAll({ where: { userId: req.user.id } });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, userId: req.user.id });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotes, createNote };