var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
  name: String,
  shared: { type: Boolean, default: false },
  numUses: { type: Date, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref : 'User'},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
