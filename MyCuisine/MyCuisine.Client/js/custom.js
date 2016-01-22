// Active class
$(function () {
    $('.nav li').click(function () {
        $('#navbar li').removeClass('active');
        $(this).addClass('active');
    });
});