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
  $('#addTaskForm').ajaxForm(
    {
      beforeSubmit: null,
      success: afterAddTask,  // post-submit callback
      dataType:  'json',
      clearForm: true,
      resetForm: true
    }
  );

  function afterAddTask(responseText, statusText, xhr, $form)
  {
    var html = '<tr class="task" id="task-' + responseText._id + '">';
    html += '<td><input id="task-checkbox-' + responseText._id + ' ' +
  'class="task-checkbox" type="checkbox"></td>';
    html += '<td>';
    html += '<strong>' + responseText.title + '</strong><br />' + responseText.course.name;
    html += '</td>';
    html += '</tr>';

    $('table').append(html);
    $("#addTaskModal").modal("hide");
  }

  $("input[name='query']").change(function(){
    $.get( "/courses/search", { query: $(this).val() } )
      .done(processCourseSearch);
  });

  // Form for search for a course
  //$('#courseSearchForm').ajaxForm({
  //  // dataType identifies the expected content type of the server response
  //  dataType:  'json',
  //
  //  // success identifies the function to invoke when the server response
  //  // has been received
  //  success:   processCourseSearch
  //});

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
        //html += '<button class="btn btn-default copyCourseLink" id="copy-' + course._id + '" href="#"><i class="fa fa-plus"></i></button>';
        html += '<a href="/courses/' + course._id + '/copy"><i class="fa fa-plus"></i></a>';
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

  $(".copyCourseLink").on('click', function(e) {
    e.preventDefault();

    var courseId = $(this).attr('id').substr('copy-'.length);

    $.ajax({
      type: "POST",
      url: "/courses/" + courseId + "/copy"
    })
      .done(function() {
        $("#addFromSourceModal").modal('hide');
        location.reload();
      });
  });

  // Transitions between modals
  $("#addFromSourceButton").on("click", function() {
    $("#addTaskModal").modal("hide");
    $("#addFromSourceModal").modal("show");
  });


  // Courses
  // Add course
  $('#addCourseForm').ajaxForm(
    {
      beforeSubmit: null,
      success: afterAddCourse,  // post-submit callback
      dataType:  'json',
      clearForm: true,
      resetForm: true
    }
  );

  function afterAddCourse(responseText, statusText, xhr, $form)
  {
    var html = '<tr id="course-' + responseText.id + '">';
    html += '<td>' + responseText.name + '</td>';
    html += '<td>';
    html += '<a href="#" class="pull-right">';
    html += '<i class="fa fa-edit fa-lg"></i></a>';
    html += '<a href="#" data-toggle="modal" data-target="#deleteCourseModal" data-course="' + responseText.id + '" ' +
    'data-name="' + responseText.name + '">';
    html += '<i class="fa fa-trash fa-lg"></i></a>';
    html += '</td>';
    html += '</tr>';

    $('table').append(html);
    $("#addCourseModal").modal("hide");
  }

  // Edit course
  $('#editCourseModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var courseId = button.data('course'); // Extract info from data-* attributes
    var courseName = button.data('nam');
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);

    // Change course name in input
    modal.find('.modal-body input').val(courseName);

    // Change to course action URL
    modal.find('#addCourseForm').attr('action', '/courses/' + courseId);
    modal.find('#addCourseForm').ajaxForm(
      {
        beforeSubmit: null,
        success: afterEditCourse,  // post-submit callback
        dataType:  'json',
        clearForm: true,
        resetForm: true
      }
    );

    function afterEditCourse(responseText, statusText, xhr, $form)
    {
      $('#course-' + responseText._id + ' .courseName').html(responseText.name);
      $("#editCourseModal").modal("hide");
    }
  });

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