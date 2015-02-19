// Get all of our friend data
var User = require('../models/User');
var Task = require('../models/Task');
var Course = require('../models/Course');
var _ = require('lodash');

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

  course.save(function(err) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    res.status(200);
    res.send("Task created!");
  });
};

exports.search = function(req, res) {
  var query = new RegExp(req.params.query);
  var courses = Course.find({ name: query })
    .populate('createdBy')
    .exec(fetchTasks);

  function fetchTasks(err, courses) {
    var courseIds = [];

    courses.forEach( function(course) {
      courseIds.push(course._id);
    });

    // Find tasks by course
    Task.find({ course: { $in: courseIds } })
      .exec(function(err, tasks) {
        // Join tasks with courses
        courseIds.forEach( function(id) {
          courses[_.findIndex(courses, '_id', id)].tasks = _.find(tasks, 'course', id);
        });

        // Respond with results
        res.status(200);
        res.json(courses);
      });
  }

};
