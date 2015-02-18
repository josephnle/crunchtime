var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
  name: String,
  tasks: [mongoose.Schema.Types.ObjectId],
  shared: Boolean,
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
