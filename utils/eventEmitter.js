const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Example: When a new task is added
myEmitter.on('taskCreated', (task) => {
  console.log(`A new task has been created: ${task.title}`);
});

module.exports = myEmitter;