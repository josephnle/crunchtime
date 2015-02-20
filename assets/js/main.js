$(document).ready(function() {
  $('.datepicker').datepicker();


  // Task list
  // Mark task as completed when clicked
  $(".task-checkbox").change(function() {
    var taskId = $(this).closest('.task').attr('id').substr('task-'.length);

    if($(this).is(':checked')){
      $(this).closest('.task').addClass('text-muted');
      $.ajax({
        type: "POST",
        url: "/tasks/" + taskId + "/complete",
        data: { completedAt: new Date() }
      })
    } else {
      $(this).closest('.task').removeClass('text-muted');
      $.ajax({
        type: "POST",
        url: "/tasks/" + taskId + "/complete",
        data: { completedAt: null }
      })
    }
  });

  // Form for adding a task
  $('#addTaskForm').ajaxForm(function() {
    $("#addTaskModal").modal("hide");
  });

  // Form for search for a course
  $('#courseSearchForm').ajaxForm({
    // dataType identifies the expected content type of the server response
    dataType:  'json',

    // success identifies the function to invoke when the server response
    // has been received
    success:   processCourseSearch
  });

  function processCourseSearch(data) {
    $("#courseSearchResults").empty();

    if($.isEmptyObject(data))
    {
      var html = '<ul class="list-group">';
      html += '<li class="list-group-item">';
      html += 'No results found. Perhaps create your own tasks?';
      html += '</li></ul>';

      $("#courseSearchResults").html(html);
    } else {
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
          html += 'DUE ' + (new Date(task.due)).toDateString();
          html += '</li>';
        });

        html += '</ul>';

        $("#courseSearchResults").append(html);
      });
    }

  }

  // Transitions between modals
  $("#addFromSourceButton").on("click", function() {
    $("#addTaskModal").modal("hide");
    $("#addFromSourceModal").modal("show");
  });

  $('#addCourseForm').ajaxForm(function() {
    $("#addCourseModal").modal("hide");
  });
});