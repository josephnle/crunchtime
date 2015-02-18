// Get all of our friend data
var Course = require('../models/Course');

exports.index = function(req, res) {
  var courses = Course.find({ createdBy: req.user._id });
  res.render('courses', courses);
};
