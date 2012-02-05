/**
 * Rewrite settings to be exported from the design doc
 */

module.exports = [

   {from: '/_couch', to: '../../../'},
   {from: '/_couch/', to: '../../../'},
   {from: '/_couch/*', to: '../../../*'},
   {from: '/apps/:ddoc/:db', to: '../../../:db/_design/:ddoc/_rewrite/'},
   {from: '/apps/:ddoc/:db/*', to: '../../../:db/_design/:ddoc/_rewrite/*'},


    {from: '/static/*', to: 'static/*'},
    {from: '/install', to: '_show/install'},
    {from: '/info', to: '_show/info'},
    {from: '/', to: 'index.html'},
    {from: '*', to: '_show/not_found'}
];
