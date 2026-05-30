import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard.jsx';
import { api } from '../services/api.js';

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadAnalytics();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!analytics) {
    return <div className="empty">Завантаження...</div>;
  }

  return (
    <section>
      <div className="page-title">
        <h2>Аналітика виконання задач</h2>
        <p>Показники формуються на основі задач, доступних поточному користувачу.</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Усього" value={analytics.total} />
        <StatCard label="Виконано" value={analytics.done} />
        <StatCard label="В роботі" value={analytics.inProgress} />
        <StatCard label="Нові" value={analytics.newTasks} />
        <StatCard label="Прострочено" value={analytics.overdue} />
        <StatCard label="Дедлайн близько" value={analytics.deadlineSoon} />
        <StatCard label="Відсоток виконання" value={`${analytics.completionRate}%`} />
      </div>
    </section>
  );
}

export default AnalyticsPage;
