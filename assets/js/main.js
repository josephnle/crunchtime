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
        url: "/tasks/" + taskId + "/uncomplete"
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


  // Courses
  // Add course
  function afterAddCourse(responseText, statusText, xhr, $form)
  {
    var html = '<tr id="course-' + responseText.id + '">';
    html += '<td>' + responseText.name + '</td>';
    html += '<td>';
    html += '<a href="#" class="pull-right">';
    html += '<i class="fa fa-edit fa-lg"></i></a>';
    html += '<a href="#" data-toggle="modal" data-target="#deleteCourseModal" data-course="' + responseText.id + '">';
    html += '<i class="fa fa-trash fa-lg"></i></a>';
    html += '</td>';
    html += '</tr>';

    $('table').append(html);
    $("#addCourseModal").modal("hide");
  }

  $('#addCourseForm').ajaxForm(
    {
      beforeSubmit: null,
      success: afterAddCourse,  // post-submit callback
      dataType:  'json',
      clearForm: true,
      resetForm: true
    }
  );

  // Remove course
  $('#deleteCourseModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var courseId = button.data('course'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    modal.find('#deleteCourseButton').on('click', function(e) {
      e.preventDefault();

      // Send request to delete course
      $.ajax({
        type: "DELETE",
        url: "/courses/" + courseId
      })
        .done(function() {
          modal.modal('hide');
          $('#course-' + courseId).remove();
        });
    });
  });
});