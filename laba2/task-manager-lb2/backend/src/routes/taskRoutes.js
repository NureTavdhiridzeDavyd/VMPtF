const express = require('express');
const {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  listReminders
} = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', listTasks);
router.get('/reminders', listReminders);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
