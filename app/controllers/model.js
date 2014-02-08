var CrudControllerFactory	= require( './core/crud-controller-factory' );
var mongoose				= require('mongoose');
var Model					= mongoose.model('Model');

var controller				= CrudControllerFactory( Model );

module.exports				= controller;