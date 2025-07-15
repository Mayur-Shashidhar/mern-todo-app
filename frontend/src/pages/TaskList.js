import React, { useState, useEffect } from 'react';
import API from '../api';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function isDueTomorrow(dateStr) {
  if (!dateStr) return false;
  const due = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return (
    due.getFullYear() === tomorrow.getFullYear() &&
    due.getMonth() === tomorrow.getMonth() &&
    due.getDate() === tomorrow.getDate()
  );
}

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', priority: 'medium', dueDate: '' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    fetchTasks();
    socket.emit('join', user.id);
    socket.on('taskCreated', task => setTasks(prev => [task, ...prev]));
    socket.on('taskUpdated', updated => setTasks(prev => prev.map(t => t._id === updated._id ? updated : t)));
    socket.on('taskDeleted', id => setTasks(prev => prev.filter(t => t._id !== id)));
    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
    // eslint-disable-next-line
  }, [user.id]);

  const fetchTasks = async () => {
    const res = await API.get(`/tasks?sortBy=${sortBy}&order=${order}`);
    setTasks(res.data);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/tasks', form);
    setForm({ title: '', priority: 'medium', dueDate: '' });
  };

  const toggleComplete = async (id, completed) => {
    await API.put(`/tasks/${id}`, { completed: !completed });
  };

  const deleteTask = async id => {
    await API.delete(`/tasks/${id}`);
  };

  const handleSort = (field) => {
    setSortBy(field);
    setOrder(order === 'asc' ? 'desc' : 'asc');
    fetchTasks();
  };

  // Notification for tasks due tomorrow
  const dueTomorrowTasks = tasks.filter(task => isDueTomorrow(task.dueDate) && !task.completed);

  return (
    <div>
      {dueTomorrowTasks.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, #ff8a00 0%, #e52e71 100%)',
          color: '#fff',
          padding: '1em',
          borderRadius: '12px',
          margin: '1em auto',
          maxWidth: 600,
          fontWeight: 600,
          boxShadow: '0 2px 16px 0 rgba(255,138,0,0.18)'
        }}>
          <span role="img" aria-label="alarm">⏰</span> You have {dueTomorrowTasks.length} task{dueTomorrowTasks.length > 1 ? 's' : ''} due tomorrow!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="New Task" value={form.title} onChange={handleChange} required />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
        <button type="submit">Add Task</button>
      </form>
      <div>
        <button onClick={() => handleSort('priority')}>Sort by Priority</button>
        <button onClick={() => handleSort('dueDate')}>Sort by Due Date</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id} style={{ textDecoration: task.completed ? 'line-through' : '' }}>
            <span>{task.title}</span>
            <span> [{task.priority}] </span>
            <span> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''} </span>
            <button onClick={() => toggleComplete(task._id, task.completed)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 