$(document).ready(function() {
  $('.datepicker').datepicker();

  $('#addTaskForm').ajaxForm(function() {
    $("#addTaskModal").modal("hide");
  });

  $("#addFromSourceButton").on("click", function() {
    $("#addTaskModal").modal("hide");
    $("#addFromSourceModal").modal("show");
  });
});