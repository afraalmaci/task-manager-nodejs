const Task = require('../models/Task');
const myEmitter = require('../utils/eventEmitter');

// List all tasks (user-based)
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Create a new task
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      userId: req.user.id,
    });

    myEmitter.emit('taskCreated', task); // Notification via EventEmitter
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Task Update
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const { title, description, priority, status, dueDate } = req.body;
    await task.update({ title, description, priority, status, dueDate });

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Delete Task
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };