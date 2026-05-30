const { readJson } = require('../utils/fileStorage');

function enrichTask(task) {
  const users = readJson('users.json');
  const user = users.find((item) => item.id === Number(task.userId));
  return {
    ...task,
    userName: user ? user.name : 'Unknown user',
    userEmail: user ? user.email : 'unknown'
  };
}

function isDeadlineClose(task) {
  if (!task.deadline || task.status === 'done') {
    return false;
  }

  const now = new Date();
  const deadline = new Date(`${task.deadline}T23:59:59`);
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
}

function isOverdue(task) {
  if (!task.deadline || task.status === 'done') {
    return false;
  }

  const today = new Date();
  const deadline = new Date(`${task.deadline}T23:59:59`);
  return deadline < today;
}

module.exports = { enrichTask, isDeadlineClose, isOverdue };
