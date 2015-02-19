var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  title: String,
  due: Date,
  completedAt: Date,
  course: String,
  shared: Boolean,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref : 'User'},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
