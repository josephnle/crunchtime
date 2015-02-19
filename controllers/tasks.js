// Get all of our friend data
var Task = require('../models/Task');
var Course = require('../models/Course');

exports.index = function(req, res) {
  var tasks = Task.find({ createdBy: req.user._id }).exec(renderTasks);

  function renderTasks(err, tasks) {
    Course.find({ createdBy: req.user._id }).exec(
      function(err, courses) {
        res.render('tasks', {'tasks': tasks, 'courses': courses});
      }
    );
  }
};

exports.create = function(req, res) {
  var task = new Task({
    title: req.body.title,
    due: req.body.due,
    createdBy: req.user._id
  });

  task.save(function(err) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    res.status(200);
    res.send("Task created!");
  });
};
