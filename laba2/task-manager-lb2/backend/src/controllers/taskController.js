const { readJson, writeJson } = require('../utils/fileStorage');
const { enrichTask, isDeadlineClose, isOverdue } = require('../services/taskService');

function getVisibleTasks(user) {
  const tasks = readJson('tasks.json');
  return user.role === 'admin' ? tasks : tasks.filter((task) => Number(task.userId) === user.id);
}

function listTasks(req, res) {
  const tasks = getVisibleTasks(req.user).map(enrichTask);
  res.json(tasks);
}

function getTask(req, res) {
  const tasks = readJson('tasks.json');
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.user.role !== 'admin' && Number(task.userId) !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(enrichTask(task));
}

function createTask(req, res) {
  const { title, description, status, priority, deadline, userId } = req.body;

  if (!title || !description || !deadline) {
    return res.status(400).json({ message: 'Title, description and deadline are required' });
  }

  const users = readJson('users.json');
  const selectedUserId = req.user.role === 'admin' ? Number(userId || req.user.id) : req.user.id;
  const assignedUser = users.find((user) => user.id === selectedUserId);

  if (!assignedUser) {
    return res.status(400).json({ message: 'Assigned user does not exist' });
  }

  const tasks = readJson('tasks.json');
  const newTask = {
    id: tasks.length ? Math.max(...tasks.map((item) => item.id)) + 1 : 1,
    title,
    description,
    status: status || 'new',
    priority: priority || 'medium',
    deadline,
    userId: selectedUserId,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  writeJson('tasks.json', tasks);
  res.status(201).json(enrichTask(newTask));
}

function updateTask(req, res) {
  const tasks = readJson('tasks.json');
  const index = tasks.findIndex((item) => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.user.role !== 'admin' && Number(tasks[index].userId) !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const updatedUserId = req.user.role === 'admin' && req.body.userId ? Number(req.body.userId) : tasks[index].userId;
  const users = readJson('users.json');

  if (!users.find((user) => user.id === updatedUserId)) {
    return res.status(400).json({ message: 'Assigned user does not exist' });
  }

  const updatedTask = {
    ...tasks[index],
    ...req.body,
    userId: updatedUserId,
    id: tasks[index].id
  };

  tasks[index] = updatedTask;
  writeJson('tasks.json', tasks);
  res.json(enrichTask(updatedTask));
}

function deleteTask(req, res) {
  const tasks = readJson('tasks.json');
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.user.role !== 'admin' && Number(task.userId) !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const filteredTasks = tasks.filter((item) => item.id !== task.id);
  writeJson('tasks.json', filteredTasks);
  res.json({ message: 'Task deleted' });
}

function listReminders(req, res) {
  const tasks = getVisibleTasks(req.user);
  const reminders = tasks
    .filter((task) => isDeadlineClose(task) || isOverdue(task))
    .map((task) => ({
      ...enrichTask(task),
      reminderType: isOverdue(task) ? 'overdue' : 'deadline_soon'
    }));

  res.json(reminders);
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask, listReminders };
