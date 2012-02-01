var templates = require('duality/templates'),
    userTypes = require('./userType'),
    jsonp = require('jsonp');


exports.not_found = function (doc, req) {
    return {
        code: 404,
        title: 'Not found',
        content: templates.render('404.html', req, {})
    };
};

exports.install = function(doc, req) {
    var is_auth = userTypes.isAdmin(req);
    return {
        code: 200,
        title: 'Install Application',
        content: templates.render('install.html', req, {
            app_url: req.query.app_url,
            is_auth : is_auth
        })
    };

}

/**
 * Used by the garden to check the existence of a dashboard over jsonp
 */

exports.info = function(doc, req) {
    return jsonp.response(req.query.callback, {
        ok: true
    });
}
