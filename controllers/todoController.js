import todos from '../models/todo.js';

// GET /api/todos
export const getTodos = (req, res) => {
    res.json(todos);
};

// GET /api/todos/:id
export const getTodo = (req, res, next) => {
    const todo = todos.find(t => t.id === req.params.id);
    if (!todo) return next(new Error('Todo not found'));
    res.json(todo);
};

// POST /api/todos
export const createTodo = (req, res) => {
    const newTodo = { id: Date.now().toString(), ...req.body };
    todos.push(newTodo);
    res.status(201).json(newTodo);
};

// PUT /api/todos/:id
export const updateTodo = (req, res, next) => {
    const index = todos.findIndex(t => t.id === req.params.id);
    if (index === -1) return next(new Error('Todo not found'));
    todos[index] = { ...todos[index], ...req.body };
    res.json(todos[index]);
};

// DELETE /api/todos/:id
export const deleteTodo = (req, res, next) => {
    const index = todos.findIndex(t => t.id === req.params.id);
    if (index === -1) return next(new Error('Todo not found'));
    const deleted = todos.splice(index, 1);
    res.json(deleted[0]);
};