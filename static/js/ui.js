


$('.help').twipsy({placement: 'bottom'});
 
var author = function () { /* ... */ };


var   books = function () { /* ... */ },
    showAuthorInfo = function() {
        alert('books');
    },
    allroutes = function(route) {
      var sections = $('section');
      sections.hide();
      sections.find('data-route[' + route + ']').show();
    };

//
// define the routing table.
//
var routes = { 
  '/author': showAuthorInfo,
  '/books': [showAuthorInfo]
};


var router = Router(routes);
router.configure({
  on: allroutes  
});
router.init();