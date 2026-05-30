const { readJson } = require('../utils/fileStorage');
const { enrichTask, isDeadlineClose, isOverdue } = require('../services/taskService');

function getVisibleTasks(user) {
  const tasks = readJson('tasks.json');
  return user.role === 'admin' ? tasks : tasks.filter((task) => Number(task.userId) === user.id);
}

function getAnalytics(req, res) {
  const tasks = getVisibleTasks(req.user);
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === 'done').length;
  const inProgress = tasks.filter((task) => task.status === 'in_progress').length;
  const newTasks = tasks.filter((task) => task.status === 'new').length;
  const overdue = tasks.filter(isOverdue).length;
  const deadlineSoon = tasks.filter(isDeadlineClose).length;
  const completionRate = total ? Math.round((done / total) * 100) : 0;

  res.json({
    total,
    done,
    inProgress,
    newTasks,
    overdue,
    deadlineSoon,
    completionRate,
    reminders: tasks.filter((task) => isDeadlineClose(task) || isOverdue(task)).map(enrichTask)
  });
}

module.exports = { getAnalytics };
