// Get all of our friend data
var Course = require('../models/Course');

exports.index = function(req, res) {
  var courses = Course.find()
    .and([
      { createdBy: req.user._id },
      { shared: true }
    ])
    .exec(renderCourses);

  function renderCourses(err, courses) {
    res.render('shared', {'title': 'Shared by Me', 'courses': courses});
  }
};
