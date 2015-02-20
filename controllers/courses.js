// Get all of our friend data
var User = require('../models/User');
var Task = require('../models/Task');
var Course = require('../models/Course');
var _ = require('lodash');
var mongoose = require('mongoose');

exports.index = function(req, res) {
  var courses = Course.find({ createdBy: req.user._id }).exec(renderCourses);

  function renderCourses(err, courses) {
    res.render('courses', {'courses': courses});
  }
};

exports.create = function(req, res) {
  var course = new Course({
    name: req.body.name,
    createdBy: req.user._id
  });

  course.save(function(err, course) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    res.status(200);
    res.json(course);
  });
};

exports.update = function(req, res) {
  Course.findOneAndUpdate({_id: req.params.id}, {name: req.body.name}, {}, function(err, course) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    res.status(200);
    res.json(course);
  })
};

exports.remove = function(req, res) {
  var courseId = req.params.id;

  // Remove tasks before removing course
  Task.find({ course: courseId })
    .remove()
    .exec(function(err) {
      if (err) {
        res.status(400);
        res.send(err);
      }

      // Remove course
      Course.findOneAndRemove({ _id: courseId }, function(err) {
        if (err) {
          res.status(400);
          res.send(err);
        }

        res.status(204);
        res.send();
      });
    });
};

exports.copy = function(req, res) {
  var courseId = req.params.id;

  // Fetch course
  Course.findById(courseId)
    .exec(function(err, course) {
      if (err) {
        res.status(400);
        res.send(err);
      }

      var newCourse = course;

      newCourse._id = mongoose.Types.ObjectId();
      newCourse.createdBy = req.user._id;

      newCourse.save(copyTasks);
    });

  function copyTasks(err, course) {
    Task.find({ course: courseId })
      .lean()
      .exec(function(err, tasks) {
        var newTasks = [];
        tasks.forEach(function(task) {
          var pickedTask = _.pick(task, ['title', 'due']);
          pickedTask.course = courseId;
          pickedTask.createdBy = req.user._id;
          newTasks.push(pickedTask);
        });

        Task.create(newTasks)
          .then(function(tasks) {
            res.status(200);
            res.redirect('/');
          });
      })
  }
};

exports.search = function(req, res) {
  var query = new RegExp(req.params.query);
  var courses = Course.find({ name: query })
    .populate('createdBy')
    .lean()
    .exec(fetchTasks);

  function fetchTasks(err, courses) {
    var courseIds = [];

    courses.forEach( function(course) {
      courseIds.push(course._id);
    });

    // Find tasks by course
    Task.find()
      .lean()
      .and([
        { course: { $in: courseIds }},
        { shared: true }
      ])
      .exec(function(err, tasks) {
        // Join tasks with courses
        courseIds.forEach( function(id) {
          var courseTasks = _.where(tasks, { 'course': id });

          // Remove course from result if tasks are private
          if (_.isEmpty(tasks))
          {
            courses.splice(_.findIndex(courses, '_id', id), 1);
          } else {
            courses[_.findIndex(courses, '_id', id)]['tasks'] = courseTasks;
          }

        });

        // Respond with results
        res.status(200);
        res.json(courses);
      });
  }

};
