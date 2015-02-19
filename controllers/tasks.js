// Get all of our friend data
var Task = require('../models/Task');

exports.index = function(req, res) {
  var tasks = Task.find({ createdBy: req.user._id });
  res.render('tasks', tasks);
};

exports.create = function(req, res) {
  var task = new Task({
    name: req.body.name,
    description: req.body.description,
    due: req.body.date,
    createdBy: req.user._id
  });

  res.status(200);
  res.send("Task created!");
};
