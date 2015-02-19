// Get all of our friend data
var Course = require('../models/Course');

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
