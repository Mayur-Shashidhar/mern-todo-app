const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const { sortBy, order } = req.query;
  let sort = {};
  if (sortBy) sort[sortBy] = order === 'desc' ? -1 : 1;
  try {
    const tasks = await Task.find({ user: req.user._id }).sort(sort);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  const { title, priority, dueDate } = req.body;
  try {
    const task = new Task({ user: req.user._id, title, priority, dueDate });
    await task.save();
    req.io.to(req.user._id.toString()).emit('taskCreated', task);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    req.io.to(req.user._id.toString()).emit('taskUpdated', task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    req.io.to(req.user._id.toString()).emit('taskDeleted', task._id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 