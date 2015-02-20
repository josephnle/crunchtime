// Get all of our friend data
var Task = require('../models/Task');
var Course = require('../models/Course');

exports.index = function(req, res) {
  var tasks = Task.find({ createdBy: req.user._id })
    .populate('course')
    .exec(renderTasks);

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
    course: req.body.course,
    shared: req.body.shared,
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

exports.complete = function(req, res) {
  var taskId = req.params.id;
  var completeTime = new Date(req.params.completedAt);

  Task.findOneAndUpdate({ _id: taskId }, { completedAt: completeTime }, {}, function(err, result) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    res.status(200);
    res.json(result);
  });
};

exports.uncomplete = function(req, res) {
  var taskId = req.params.id;

  Task.findOneAndUpdate({ _id: taskId }, { $unset: {completedAt: 1} }, {}, function(err, result) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    res.status(200);
    res.json(result);
  });
};
