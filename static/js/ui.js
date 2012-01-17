
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

function dbRoot(location) {
    return location.protocol + '//' + location.host + '/';
}


function getApps(callback) {
    var data = {};
    data.apps = [
        {
            img  : 'http://placehold.it/210x150',
            name : 'Angry Todos',
            db   : 'angry-todos',
            start_url : '_design/angrytodos/_rewrite/'
        },
        {
            img  : 'http://placehold.it/210x150',
            name : 'Web Bookmarks',
            db   : 'webmarks',
            start_url : '_design/webmarks/_rewrite/'
        } 
    ];
    var root = dbRoot(window.location);
    data.apps = _.map(data.apps, function(row) {
       row.start_url = root + row.db + '/' + row.start_url;
       return row;
    });
    callback(data);
}


function showApps() {
    show('apps');

    getApps(function(data) {
        if (!data.apps || data.apps.length === 0) {
            $('.message').html(handlebars.templates['no_apps_message.html']({}, {}));
            return;
        }

        $('.app').append(handlebars.templates['app_list.html'](data, {}));


        $('ul.app .thumbnail').click(function(){

            var name = $(this).data('name');
            var link = $(this).parent().attr('href');
            // animate the top bar, giving user context
            

            $('.navbar .nav > li > a').hide(700);

            setTimeout(function(){
                $('.navbar-inner a.brand').text(name);
                $('#garden-navigation').show(400);
            }, 200)

            setTimeout(function() {
                window.location = link;
            }, 700);


            return false;


        });



        $('ul.app .thumbnail i')
           .twipsy({placement: 'bottom'})
            .click(function() {
                $('.twipsy').hide(); // seems to linger
                var db = $(this).data('db');
                try {
                   router.setRoute('/apps/info/' + db);
                } catch(e) {
                    console.log(e);
                }                
                return false;
            })




    });
}


function getMarkets(callback) {
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


function showMarkets() {
    show('markets');
    getMarkets(function(data) {
        $('ul.gardens').append(handlebars.templates['garden_details.html'](data, {}));
    })

    $('.add-market').click(function() {
        $('.add-market').hide();
        $('.new-market').show(500);
    });

    $('.cancel').click(function() {
        $('.add-market').show();
        $('.new-market').hide(500);
    });


}

function viewApp(dbName) {
    $('.nav li').removeClass('active');
    $('.nav li.apps' ).addClass('active');

    var context = {
        app_name : 'Angry Todo'
    };

    $('.main').html(handlebars.templates['app_details.html'](context, {}));
}


var routes = {
  '/apps'   : showApps,
  '/apps/info/:db' : viewApp,
  '/markets': showMarkets,
  '/sync'   : function() {show('sync')},
  '/settings'   : function() {show('settings')}
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

       