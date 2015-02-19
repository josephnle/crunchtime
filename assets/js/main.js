$(document).ready(function() {
  $('.datepicker').datepicker();

  $('#addTaskForm').ajaxForm(function() {
    $("#addTaskModal").modal("hide");
  });

  $('#courseSearchForm').ajaxForm({
    // dataType identifies the expected content type of the server response
    dataType:  'json',

    // success identifies the function to invoke when the server response
    // has been received
    success:   processCourseSearch
  });

  function processCourseSearch(data) {
    $("#courseSearchResults").empty();
    data.forEach(function(course) {
      var html = '<ul class="list-group">';
      html += '<li class="list-group-item">';
      html += '<div class="pull-right">';
      html += '<i class="fa fa-plus"></i>';
      html += '</div>';
      html += '<strong> ' + course.name + '<br/>by ' + course.createdBy.profile.name + '</strong>';
      html += '</li>';

      course.tasks.forEach(function(task) {
        html += '<li class="list-group-item">';
        html += task.title;
        html += '<br />';
        html += 'DUE ' + task.due;
        html += '</li>';
      });

      html += '</ul>';

      $("#courseSearchResults").append(html);
    });
  }

  $("#addFromSourceButton").on("click", function() {
    $("#addTaskModal").modal("hide");
    $("#addFromSourceModal").modal("show");
  });

  $('#addCourseForm').ajaxForm(function() {
    $("#addCourseModal").modal("hide");
  });
});