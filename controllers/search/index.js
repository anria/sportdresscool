'use strict';

var request = require('request');
var prodperpage = 20;
var solrHost = 'http://blood-dx.com:8985/solr/sportdc/dc';
//var solrHost = 'http://localhost:8983/solr/collection1/dc';



module.exports = function (router) {

    router.get('/', function (req, res) {
		var q = req.query.search;
		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

		// console.log('base route . ' + q);
    	var solrUrl = solrHost + '?q=' + encodeURIComponent(q);
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = [];
				var startpage = (page-5 >= 0) ? page-5 : 0;

				for(var i=startpage; i<(startpage+11); i++){
				 	pages.push(i);
				}
				pages.push( '...' );
				pages.push( parseInt(numPages) );


				res.render('index', {title:'Sports Wear DressCool', 
					h1:'Results for : ' + q, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/search/'+q
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	


};
