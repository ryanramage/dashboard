
var templates = require('duality/templates');

exports.not_found = function (doc, req) {
    return {
        code: 404,
        title: 'Not found',
        content: templates.render('404.html', req, {})
    };
};

exports.install = function(doc, req) {
    return {
        code: 200,
        title: 'Install Application',
        content: templates.render('install.html', req, {app_url: req.query.app_url, app_name: req.query.app_name})
    };

}