import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';

const initialForm = {
  title: '',
  description: '',
  status: 'new',
  priority: 'medium',
  deadline: '',
  userId: ''
};

function TaskFormPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const isEdit = Boolean(id);

  useEffect(() => {
    async function init() {
      try {
        if (user.role === 'admin') {
          const userList = await api.getUsers();
          setUsers(userList);
        }

        if (isEdit) {
          const task = await api.getTask(id);
          setForm({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            deadline: task.deadline,
            userId: String(task.userId)
          });
        } else {
          setForm((current) => ({ ...current, userId: String(user.id) }));
        }
      } catch (err) {
        setError(err.message);
      }
    }

    init();
  }, [id, isEdit, user.id, user.role]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      const payload = {
        ...form,
        userId: Number(form.userId || user.id)
      };

      if (isEdit) {
        await api.updateTask(id, payload);
      } else {
        await api.createTask(payload);
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel">
      <h2>{isEdit ? 'Редагування задачі' : 'Створення задачі'}</h2>

      <form onSubmit={submit} className="form wide-form">
        <label>
          Назва
          <input name="title" value={form.title} onChange={updateField} required />
        </label>

        <label>
          Опис
          <textarea name="description" value={form.description} onChange={updateField} required />
        </label>

        <div className="form-row">
          <label>
            Статус
            <select name="status" value={form.status} onChange={updateField}>
              <option value="new">Нова</option>
              <option value="in_progress">В роботі</option>
              <option value="done">Виконано</option>
            </select>
          </label>

          <label>
            Пріоритет
            <select name="priority" value={form.priority} onChange={updateField}>
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
            </select>
          </label>
        </div>

        <label>
          Дедлайн
          <input type="date" name="deadline" value={form.deadline} onChange={updateField} required />
        </label>

        {user.role === 'admin' && (
          <label>
            Виконавець
            <select name="userId" value={form.userId} onChange={updateField} required>
              <option value="">Оберіть користувача</option>
              {users.map((item) => (
                <option key={item.id} value={item.id}>{item.name} — {item.email}</option>
              ))}
            </select>
          </label>
        )}

        {error && <div className="error">{error}</div>}

        <button className="primary-button" type="submit">
          {isEdit ? 'Зберегти зміни' : 'Створити задачу'}
        </button>
      </form>
    </section>
  );
}

export default TaskFormPage;
