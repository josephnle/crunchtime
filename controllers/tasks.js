// Get all of our friend data
var Task = require('../models/Task');
var Course = require('../models/Course');

exports.index = function(req, res) {
  var tasks = Task.find({createdBy: req.user._id})
    .populate('course')
    .sort('due')
    .exec(renderTasks);

  function renderTasks(err, tasks) {
    Course.find({createdBy: req.user._id}).exec(
      function(err, courses) {
        var random_num = Math.random();

        if(random_num > 0.5){
          res.render('tasks', {'title': 'Tasks', 'tasks': tasks, 'courses': courses});
        }else{
          res.render('tasks_alternate', {'title': 'Tasks', 'tasks': tasks, 'courses': courses});
        }
      }
    );
  }
};

exports.create = function(req, res) {
  Course.find({createdBy: req.user._id}).exec(
    function(err, courses) {
      res.render('tasks/add_task', {'title': 'Add Task', 'courses': courses});
    }
  );
};

exports.createFromSource = function(req, res) {
  Course.find({createdBy: req.user._id}).exec(
    function(err, courses) {
      res.render('tasks/add_task_from_source', {'title': 'Add Task from Source', 'courses': courses});
    }
  );
};

exports.store = function(req, res) {
  var task = new Task({
    title: req.body.title,
    due: req.body.due,
    course: req.body.course,
    shared: req.body.shared,
    createdBy: req.user._id
  });

  task.save(function(err, task) {
    if (err) {
      res.status(400);
      res.send(err);
    }

    Task.findOne(task).populate('course').exec(function(err, task) {
      // Update shared status if shared
      if (req.body.shared) {
        Course.findOneAndUpdate({_id: req.body.course}, {shared: true}, {}, function(err, result) {
          if (err) {
            res.status(400);
            res.send(err);
          }
          res.status(200);
          res.redirect('/');
        })
      }
      else {
        res.status(200);
        res.redirect('/');
      }
    });
  });
};

exports.complete = function(req, res) {
  var taskId = req.params.id;
  var completeTime = new Date(req.params.completedAt);

  Task.findOneAndUpdate({_id: taskId}, {completedAt: completeTime}, {}, function(err, result) {
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

  Task.findOneAndUpdate({_id: taskId}, {$unset: {completedAt: 1}}, {}, function(err, result) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    res.status(200);
    res.json(result);
  });
};
