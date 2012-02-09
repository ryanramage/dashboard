/**
 * Rewrite settings to be exported from the design doc
 * {from: '/*', to: '../../../*', query : {base_url : '*'}}
 */

module.exports = [

    {from: '/_couch', to: '../../../'},
    {from: '/_couch/', to: '../../../'},
    {from: '/_couch/*', to: '../../../*'},

    {from: '/static/*', to: 'static/*'},
    {from: '/install', to: '_show/install'},
    {from: '/', to: 'index.html'},

    
    {from: '/:db/_design/:ddoc/_rewrite', to: '../../../:db/_design/:ddoc/_rewrite/'},
    {from: '/:db/_design/:ddoc/_rewrite/*', to: '../../../:db/_design/:ddoc/_rewrite/*'}
];
