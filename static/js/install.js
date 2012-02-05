var _ = require('underscore')._;
var handlebars = require('handlebars');
var garden_urls = require('lib/garden_urls');
var current_db = require('db').use('_db');
var async = require('async');
var session = require('session');
var users = require("users");
var userType = require('lib/userType');

$(function() {


    function getMarkets(callback) {
        current_db.getView('dashboard', 'by_markets', {include_docs: true}, function(err, response) {
            if (err) return alert('cant load markets');
            var data = {};
            data.gardens =  _.map(response.rows, function(row) {
                return {
                    name : row.key,
                    url : row.value
                }
            });
            data.gardens.push({
                type: 'market',
                name : "Kanso Market",
                url : "http://garden.iriscouch.com/garden/_design/garden/_rewrite/"
            });

            data = addDashboardUrl(data);
            callback(data);
        });
    }

    function showMarkets() {
        getMarkets(function(data) {
            $('ul.gardens').html(handlebars.templates['garden_details.html'](data, {}));
        })

        $('.add-market').click(function() {
            $('.add-market').hide();
            $('.new-market').show(500);
            return false;
        });

        $('.cancel').click(function() {
            $('.add-market').show();
            $('.new-market').hide(500);
            return false;
        });

        $('#add-market-final').click(function() {

            var market = {
                type : 'market',
                url : $('#market-url').val(),
                name : $('#market-name').val()
            }

            current_db.saveDoc(market, function(err, response) {
                if (err) return alert('could not save');
                var d = {
                    gardens : [market]
                }
                d = addDashboardUrl(d);
                $('ul.gardens').append(handlebars.templates['garden_details.html'](d, {}));

                $('.add-market').show();
                $('.new-market').hide(500);
            })

            return false;

        });
    }

    

    function errorLoadingInfo() {
        $('.loading').html(handlebars.templates['install_app_error.html']({}, {}));
    }


    var appurl  = $('.loading').data('appurl');
    var app_json_url = garden_urls.app_details_json(appurl);

    var db_name;
    var app_data;

    if (appurl) {
        $.ajax({
            url : app_json_url + "?callback=?",
            dataType : 'json',
            jsonp : true,
            success : function(data) {
                app_data = data;
                try {
                    app_data.src = appurl
                    $('.loading').html(handlebars.templates['install_app_info.html'](app_data, {}));
                    // check if this db has been taken
                    $.couch.allDbs({
                        success : function(data) {
                            db_name = garden_urls.find_next_db_name(app_data.doc_id, data);
                            $('.form-actions').show();
                        }
                    });


                } catch(e) {
                    errorLoadingInfo();
                }
            },
            error : function() {
                errorLoadingInfo();
            }
        });
    }
    session.info(function(err, info) {
        adjustUIforUser(info);
    });



    showMarkets();


    function errorInstalling(){

    }

    function updateStatus(msg, percent, complete) {
        console.log(msg, percent, complete);
        $('.install-info h4').text(msg);
        $('.install-info .bar').css('width', percent);
        if (complete) {
            $('.install-info .progress').removeClass('active');
        }
    }


    $('.primary').live('click', function(){
        $('.form-actions').hide();
        $('.install-info').show();


       updateStatus('Installing App', '30%');
       $.couch.replicate(app_data.db_src, db_name, {
           success : function() {
                var db = $.couch.db(db_name);
                copyDoc(db);
           },
           error : errorInstalling
       }, {
          create_target:true,
          doc_ids : [app_data.doc_id]
       });


    })



    function copyDoc(db) {
       updateStatus('Cleaning up', '80%');
       db.copyDoc(
           app_data.doc_id,
           {
                error: errorInstalling,
                success: function() {
                    deleteDoc(db);
                }
           },
           {
                headers : {Destination : '_design/' + app_data.doc_id}
            }
        );
    }

    function deleteDoc(db) {
        updateStatus('Cleaning up', '90%');
        db.headDoc(app_data.doc_id, {}, {
            success : function(data, status, jqXHR) {
                updateStatus('Cleaning up', '95%');
                var rev = jqXHR.getResponseHeader('ETag').replace(/"/gi, '');
                console.log(rev);
                db.removeDoc({_id : app_data.doc_id, _rev : rev}, {
                    success :  saveAppDetails,
                    error : saveAppDetails
                });
            }
        });
    }

    function saveAppDetails() {
        updateStatus('Recording Install', '95%');
        app_data.installed  = {
            date : new Date().getTime(),
            db : db_name
        }
        app_data.dashboard_title = app_data.kanso.config.name;
        app_data.type = 'install';
        current_db.saveDoc(app_data, function() {
            updateStatus('Setting security', '98%', true);
            setSecurityToAdmins(app_data);
        });
    }


    function setSecurityToAdmins(app_data) {
        addDBReaderRole(db_name, '_admin', function(err) {
            updateStatus('Install Complete', '100%', true);
            var link = garden_urls.get_launch_url(app_data);

            $('.success')
                .attr('href', link)
                .show();
        });
    }



});