var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
  name: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref : 'Task'}],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref : 'User'},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
