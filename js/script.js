$(document).ready(function () {
  $('#searchInput').on('keyup', function () {
    var value = $(this).val().toLowerCase();
    console.log(value)
    $('#personTable tbody tr').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

