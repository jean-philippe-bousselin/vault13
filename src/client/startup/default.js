Meteor.startup(function () {

    // reexec momentum date every minute
    function momentumReapply() {
        $('.momentum').each(function() {
            $(this).html(moment($(this).data('date-original')).fromNow());
        });
        Meteor.setTimeout(momentumReapply, 30000);
    }
    Meteor.setTimeout(momentumReapply, 30000);
});