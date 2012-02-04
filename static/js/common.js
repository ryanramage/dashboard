function oneUrl(location) {
    return location.protocol + '//' + location.host ;
}

function dbRoot(location) {
    return location.protocol + '//' + location.host + '/';
}


function addDashboardUrl(data) {
    var dashboardUrl = oneUrl(window.location);
    data.gardens = _.map(data.gardens, function(row) {
       row.url = row.url + '?dashboard=' + dashboardUrl;
       return row;
    });
    return data;
}


function adjustUIforUser(info, callback) {
        var isAdmin = userType.isAdmin(info);
        if (!isAdmin) {
            $('.admin-only').hide();
        } else {
            $('.admin-only').show();
        }

        var isUser = userType.isUser(info);
        if (isUser) {
            $('.user').show();
            $('.username').text(userType.getUsername(info));
            $('.login').hide();
        } else {
            $('.user').hide();
            $('.login').show();
        }
        if (callback) callback();


}



$(function() {
    $('#garden-navigation').twipsy({placement: 'right'});
    $('.help').twipsy({placement: 'bottom'});


    $('.modal .cancel').live('click', function() {
        $(this).parent().parent().modal('hide');
    });
    $('.logout').live('click', function() {
        session.logout(function(err){
            if (err) return alert('There was a problem logging out');
            adjustUIforUser({});
        });


    });

});