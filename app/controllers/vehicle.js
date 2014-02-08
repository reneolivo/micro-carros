var CrudControllerFactory	= require( './core/crud-controller-factory' );
var mongoose				= require('mongoose');
var Model					= mongoose.model('Vehicle');

var filters					= function filters(req) {
	var filters				= [];

	if(typeof req.query['min-year'] !== 'undefined') {
		filters.push({year: {$gte: req.query['min-year']}});
	}

	if(typeof req.query['max-year'] !== 'undefined') {
		filters.push({year: {$lte: req.query['max-year']}});
	}

	return filters;
}


var controller				= CrudControllerFactory( Model, filters );

module.exports				= controller;