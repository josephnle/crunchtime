// Get all of our friend data
var Task = require('../models/Task');

exports.index = function(req, res) {
  var tasks = Task.find({ createdBy: req.user._id });
  res.render('index', tasks);
};
