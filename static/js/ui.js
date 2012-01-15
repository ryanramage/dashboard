
var _ = require('underscore')._;
var handlebars = require('handlebars');


var show = function(what, context) {
    if (!context) context = {};
    $('.nav li').removeClass('active');
    $('.nav li.' + what).addClass('active');
    $('.main').html(handlebars.templates[what + '.html'](context, {}));
} 


function oneUrl(location) {
    return location.protocol + '//' + location.host + location.pathname;
}


function showApps() {
    show('apps');    
    var data = {};
    data.apps = [
        {
            img : 'http://placehold.it/210x150',
            name : 'Angry Todos'
        },
        {
            img : 'http://placehold.it/210x150',
            name : 'Test Runner'
        }
    ];
    if (!data.apps || data.apps.length === 0) {
        $('.message').html(handlebars.templates['no_apps_message.html']({}, {}));
    } else {
        $('.app').append(handlebars.templates['app_details.html'](data, {}));
    }
}


function getGardens(callback) {
    var data = {};
    data.gardens = [
        {
            name : "IrisCouch Market",
            url : "https://garden.iriscouch.com"
        }
    ];
    var dashboardUrl = oneUrl(window.location);
    data.gardens = _.map(data.gardens, function(row) {
       row.url = row.url + '?dashboard=' + dashboardUrl;
       return row;
    });

    callback(data);
}


function showGardens() {
    show('gardens');
    getGardens(function(data) {
        $('ul.gardens').append(handlebars.templates['garden_details.html'](data, {}));
    })

    $('.add-market').click(function() {
        $('.new-market').show(500);
    });

    $('.cancel').click(function() {
        $('.new-market').hide(500);
    });

}



var routes = {
  '/apps'   : showApps,
  '/gardens': showGardens,
  '/sync'   : function() {show('sync')}
};


var router = Router(routes).init('/apps');


$(function() {
    $('.help').twipsy({placement: 'bottom'});


    //query feeds
    var data = [];
    data.feeds = [
        {
            app : 'http://placehold.it/20x20',
            message : 'You added Get Milk',
            date: '2012-01-13T09:24:17Z'
        }

    ]
    $('.feed').append(handlebars.templates['feed_details.html'](data, {}));


    $('.timeago').each(function() {
       var textTime = $(this).attr('title');
       var date = Date.parse(textTime);
       var text = moment(date).fromNow();
       $(this).text(text);
       $(this).attr('title', moment(date).calendar());

    }).twipsy({placement: 'right'});


//    var last_thumb;
//    var showMenu = _.debounce(function() {
//        $('.app .thumbnail').popover('hide');
//        last_thumb.popover('show');
//    }, 1000);
//
//    $('.app .thumbnail')
//        .popover({
//            placement: 'bottom',
//            content : '<a href="">Settings</a>',
//            trigger : 'manual'
//        })
//        .mouseover(function() {
//           last_thumb = $(this);
//           showMenu();
//        });



}) 

       