var mongoose	= require( 'mongoose' );
var async		= require( 'async' );

var Make		= mongoose.model( 'Make' );
var Model		= mongoose.model( 'Model' );
var Color		= mongoose.model( 'Color' );



exports.index = function(req, res){
	res.render('admin/index', {
		
	});
}

//###### MODULES: ######//

exports.module = function(req, res) {
	var module	= req.params.module;

	if (typeof requirements[ module ] === 'function') {
		requirements[ module ](module, req, res, function(model) {
			module_find( module, req, res, model );
		});
	} else {
		module_find( module, req, res, {} );
	}

}

var requirements = {
	allOf	: function(module, req, res, callback) {
		var module = mongoose.model( module );

		if (typeof callback !== 'function') callback = function() {};

		module.find(function(err, result) {
			if (err) throw new Error( err );

			callback( result );
		});
	},
	model	: function(module, req, res, callback) {
		this.allOf('Make', req, res, function(result) {
			callback( { make: result } )
		});
	},
	vehicle	: function(module, req, res, callback) {
		async.parallel(
			{
				models	: function(asyncCallback) {
					mongoose.model( 'Model' )
						.find( asyncCallback)
						.populate( 'make' )
					;
				},
				colors	: function(asyncCallback) {
					mongoose.model( 'Color' )
						.find( asyncCallback )
					;
				},
				components	: function(asyncCallback) {
					mongoose.model( 'Component' )
						.find( asyncCallback )
					;
				}
			},
			function(err, model) {
				if (err) throw new Error( err );

				callback( model );
			}
		)
	}
}

function module_find(module, req, res, modelData) {
	var model	= mongoose.model( ucfirst( module ) );

	if (typeof modelData === 'undefined') modelData = {};

	model.$find({}, function(err, results) {
		if (err) throw new Error( err );

		modelData.items = results;

		res.render('admin/modules/' + module, {
			layout	: 'admin/layout',
			model	: modelData
		});
	});
}

function ucfirst( string ) {
	string = string + '';

	return string.charAt( 0 ).toUpperCase() + string.slice( 1 ).toLowerCase();
}

function execute(method, req, res) {
	var model = mongoose.model( ucfirst( req.params.model ) );

	model[ method ]( req.body, function(err, result) {
		if (err) {
			return res.json( { success: false, error: err, result: null } );
		}

		res.redirect( '/admin/' + req.params.model );
	});
}

exports.create = function(req, res) {
	execute( '$create', req, res );
}

exports.update = function(req, res) {
	req.body._id = req.params.id;

	execute( '$update', req, res );
}

exports.delete = function(req, res) {
	var model = mongoose.model( ucfirst( req.params.model ) );

	model.$delete( req.params.id, function(err, result) {
		if (err) {
			return res.json( { success: false, error: err, result: null } );
		}

		res.redirect( '/admin/' + req.params.model );
	});
}