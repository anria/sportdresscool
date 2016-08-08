'use strict';

var request = require('request');
//var solrHost = 'http://localhost:8983/solr/collection1/autosuggest';
var solrHost = 'http://blood-dx.com:8985/solr/sportdc/autosuggest';


module.exports = function (router) {
    router.get('/:q', function (req, res) {
		var q = req.params.q;
    	var solrUrl = solrHost + '?q=' + q;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var arr = [];
				
				json.response.docs.forEach(function(value){
					arr.push(value.autosuggest[0] );
				});

				res.json( arr );
				// res.json( json.response.docs );
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});

    router.get('/', function (req, res) {
		var q = req.query.term;
    	var solrUrl = solrHost + '?q=' + q;
		request(solrUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body);
				var arr = [];
				
				json.response.docs.forEach(function(value){
					arr.push(value.autosuggest[0] );
				});

				res.json( arr );
				// res.json( json.response.docs );
			}else{
				res.json( {error:'No Suggestions For you' } );
			}
		});
	});	
};
