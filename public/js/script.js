$(function() {
    $.getJSON('/rest/todos', function(result) {
        $.each(result, function(i, field) {
            var childElement = '<tr>'
                             +     '<td>' + field.username +'</td>'
                             +     '<td>' + field.todo +'</td>'
                             +     '<td>' + field.isDone +'</td>'
                             +     '<td>' + field.hasAttachment +'</td>'
                             + '</tr>';
            $('tbody').append(childElement);
        });
    });
});