'use strict';

//var IndexModel = require('../models/index');
var request = require('request');
var prodperpage = 20;
var solrHost = 'http://blood-dx.com:8985/solr/sportdc/dc';
// var solrHost = 'http://localhost:8983/solr/collection1/dc';
var facetHash = {'team':'team_string', 'apparel':'apparel_string_mv', 'department':'department_en_string_mv', 
				'league':'league_en_string', 'conference':'conference_en_string', 'size':'size_string_mv',
				'gender':'genderCategoryName_text_en_mv', 'brand':'brand_s' }

function getPaginationArray(page, numFound){
	var numPages =  parseInt(numFound) / prodperpage; 
	var upto = 5;
	var startpage = (page-5 >= 0) ? page-5 : 0;

	if(numPages >= page + 5){
		upto = page + 5;
	}else{
		upto = numPages;
	}
	var pages = [];
	if(numPages >= 1){

		for(var i=startpage; i<upto; i++){
		 	pages.push(i);
		}
		pages.push( '...' );
		pages.push( parseInt(numPages) );
	}else{
		pages.push(0);
	}
	return pages;
}


module.exports = function (router) {
    router.get('/', function (req, res) {

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);
    	var solrUrl = solrHost + '?q=*:*';

		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				console.log('solr said : '  + json.responseHeader.QTime);
		
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages =  getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1:'Sports Wear and Novelties', 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/all-products'

				});
			}else{
				res.render('index', {title:'index' } );
			}
		});
	});

    router.get('/all-products/:page', function (req, res) {
		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=*:*&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				console.log('solr said : '  + json.responseHeader.QTime);
		
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1:'Sports Wear and Novelties', 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/all-products'

				});
			}else{
				res.render('index', {title:'index' } );
			}
		});
	});

    router.get('/search/:search/:page', function (req, res) {
		var q = req.params.search;
		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

		// console.log('****** base route w/page . ' + q);
    	var solrUrl = solrHost + '?q=' + encodeURIComponent(q) + '&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

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

    router.get('/search/:search/:facet1/:parm1', function (req, res) {
		var q = req.params.search;
		var facet1 = req.params.facet1;
		var facet2 = req.params.facet2;
		var parm1 = req.params.parm1;
		var parm2 = req.params.parm2;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=' + encodeURIComponent(q) + '&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) + '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);

				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: q + ' > ' + parm1 , 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/search/' + q + '/' + facet1 + '/'+ parm1 
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	

    router.get('/search/:search/:facet1/:parm1/:page', function (req, res) {
		var q = req.params.search;
		var facet1 = req.params.facet1;
		var facet2 = req.params.facet2;
		var parm1 = req.params.parm1;
		var parm2 = req.params.parm2;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=' + encodeURIComponent(q) + '&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) + '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: q + ' > ' + parm1 , 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/search/' + q + '/' + facet1 + '/'+ parm1 
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	

    router.get('/search/:search/:facet1/:parm1/:facet2/:parm2', function (req, res) {
		var q = req.params.search;
		var facet1 = req.params.facet1;
		var facet2 = req.params.facet2;
		var parm1 = req.params.parm1;
		var parm2 = req.params.parm2;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=' + encodeURIComponent(q) + '&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) + '"&fq=' + facetHash[facet2] + ':"' + encodeURIComponent(parm2) + '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: q + ' > ' + parm1 + ' > ' + parm2, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/search/' + q + '/' + facet1 + '/'+ parm1 + '/'+ facet2 + '/'+ parm2
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	

    router.get('/search/:search/:facet1/:parm1/:facet2/:parm2/:page', function (req, res) {
		var q = req.params.search;
		var facet1 = req.params.facet1;
		var facet2 = req.params.facet2;
		var parm1 = req.params.parm1;
		var parm2 = req.params.parm2;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=' + encodeURIComponent(q) + '&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) + '"&fq=' + facetHash[facet2] + ':"' + encodeURIComponent(parm2) + '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: q + ' > ' + parm1 + ' > ' + parm2, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/search/' + q + '/' + facet1 + '/'+ parm1 + '/'+ facet2 + '/'+ parm2
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	

    router.get('/search/:search/:facet1/:parm1/:facet2/:parm2/:facet3/:parm3', function (req, res) {
		var q = req.params.search;
		var facet1 = req.params.facet1;
		var facet2 = req.params.facet2;
		var facet3 = req.params.facet3;
		var parm1 = req.params.parm1;
		var parm2 = req.params.parm2;
		var parm3 = req.params.parm3;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=' + encodeURIComponent(q) 
    				+ '&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) 
    				+ '"&fq=' + facetHash[facet2] + ':"' + encodeURIComponent(parm2) 
    				+ '"&fq=' + facetHash[facet3] + ':"' + encodeURIComponent(parm3) 
					+ '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: q + ' > ' + parm1 + ' > ' + parm2+ ' > ' + parm3, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/search/' + q + '/' + facet1 + '/'+ parm1 + '/'+ facet2 + '/'+ parm2 + '/'+ facet3 + '/'+ parm3
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	

    router.get('/search/:search/:facet1/:parm1/:facet2/:parm2/:facet3/:parm3/:page', function (req, res) {
		var q = req.params.search;
		var facet1 = req.params.facet1;
		var facet2 = req.params.facet2;
		var facet3 = req.params.facet3;
		var parm1 = req.params.parm1;
		var parm2 = req.params.parm2;
		var parm3 = req.params.parm3;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=' + encodeURIComponent(q) + '&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) 
    				+ '"&fq=' + facetHash[facet2] + ':"' + encodeURIComponent(parm2) 
    				+ '"&fq=' + facetHash[facet3] + ':"' + encodeURIComponent(parm3) 
					+ '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: q + ' > ' + parm1 + ' > ' + parm2, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/search/' + q + '/' + facet1 + '/'+ parm1 + '/'+ facet2 + '/'+ parm2 + '/'+ facet3 + '/'+ parm3
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	





    router.get('/:facet1/:parm1', function (req, res) {
		var facet1 = req.params.facet1;
		var parm1 = req.params.parm1;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=*:*&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) + '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: facet1 + ' : ' + parm1, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/' + facet1 + '/'+ parm1 
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	

    router.get('/:facet1/:parm1/:page', function (req, res) {
		var facet1 = req.params.facet1;
		var parm1 = req.params.parm1;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=*:*&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) + '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: facet1 + ' : ' + parm1, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/' + facet1 + '/'+ parm1 
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	

    router.get('/:facet1/:parm1/:facet2/:parm2', function (req, res) {
		var facet1 = req.params.facet1;
		var facet2 = req.params.facet2;
		var parm1 = req.params.parm1;
		var parm2 = req.params.parm2;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=*:*&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) + '"&fq=' + facetHash[facet2] + ':"' + encodeURIComponent(parm2) + '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: parm1 + ' > ' + parm2, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/' + facet1 + '/'+ parm1 + '/'+ facet2 + '/'+ parm2
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	

    router.get('/:facet1/:parm1/:facet2/:parm2/:page', function (req, res) {
		var facet1 = req.params.facet1;
		var facet2 = req.params.facet2;
		var parm1 = req.params.parm1;
		var parm2 = req.params.parm2;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=*:*&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) + '"&fq=' + facetHash[facet2] + ':"' + encodeURIComponent(parm2) + '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: parm1 + ' > ' + parm2, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/' + facet1 + '/'+ parm1 + '/'+ facet2 + '/'+ parm2
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	

    router.get('/:facet1/:parm1/:facet2/:parm2/:facet3/:parm3', function (req, res) {
		var facet1 = req.params.facet1;
		var facet2 = req.params.facet2;
		var facet3 = req.params.facet3;
		var parm1 = req.params.parm1;
		var parm2 = req.params.parm2;
		var parm3 = req.params.parm3;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=*:*&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) 
    				+ '"&fq=' + facetHash[facet2] + ':"' + encodeURIComponent(parm2) 
    				+ '"&fq=' + facetHash[facet3] + ':"' + encodeURIComponent(parm3) 
    				+ '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: parm1 + ' > ' + parm2, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/' + facet1 + '/'+ parm1 + '/'+ facet2 + '/'+ parm2 + '/'+ facet3 + '/'+ parm3
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	

    router.get('/:facet1/:parm1/:facet2/:parm2/:facet3/:parm3/:page', function (req, res) {
		var facet1 = req.params.facet1;
		var facet2 = req.params.facet2;
		var facet3 = req.params.facet3;
		var parm1 = req.params.parm1;
		var parm2 = req.params.parm2;
		var parm3 = req.params.parm3;

		var page = req.params.page ? req.params.page : 0;
		var start = (parseInt(page) * prodperpage);

    	var solrUrl = solrHost + '?q=*:*&fq=' + facetHash[facet1] + ':"' + encodeURIComponent(parm1) 
    				+ '"&fq=' + facetHash[facet2] + ':"' + encodeURIComponent(parm2) 
    				+ '"&fq=' + facetHash[facet3] + ':"' + encodeURIComponent(parm3) 
    				+ '"&start=' + start;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var numPages =  parseInt(json.response.numFound) / prodperpage; 
				var pages = getPaginationArray(page,json.response.numFound);

				res.render('index', {title:'Sports Wear DressCool', 
					h1: parm1 + ' > ' + parm2, 
					found: json.response.numFound + ' results found',
					results: json.response.docs,
					facets:  json.facet_counts.facet_fields,
					pages: pages,
					thispage: page,
					pagination: '/' + facet1 + '/'+ parm1 + '/'+ facet2 + '/'+ parm2 + '/'+ facet3 + '/'+ parm3
				});
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	



};
