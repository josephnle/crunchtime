var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  due: Date,
  completedAt: Date,
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
