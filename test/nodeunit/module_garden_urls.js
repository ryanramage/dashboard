var garden_urls = require('../../lib/garden_urls');


exports.test_incr_app_name = function(test) {

    var db = "test";
    var next = garden_urls.incr_app_name(db);
    test.equal(next, "test_1");

    db = "test_1";
    next = garden_urls.incr_app_name(db);
    test.equal(next, "test_2");

    db = "test_21";
    next = garden_urls.incr_app_name(db);
    test.equal(next, "test_22");

    db = "test_cool";
    next = garden_urls.incr_app_name(db);
    test.equal(next, "test_cool_1");


    db = "test_cool_10";
    next = garden_urls.incr_app_name(db);
    test.equal(next, "test_cool_11");

    test.done();
}



exports.find_next_db = function(test) {
    var name = "test";
    var current_dbs = ["_users", "alpha"];
    var next = garden_urls.find_next_db_name(name, current_dbs);
    test.equal(next, "test");

    name = "test";
    current_dbs = ["_users", "alpha", "test"];
    next = garden_urls.find_next_db_name(name, current_dbs);
    test.equal(next, "test_1");


    test.done();
}