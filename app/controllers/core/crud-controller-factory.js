var async = require('async');

function CrudControllerFactory(model, filtersFN) {
	return {
		model	: model,
		index	: function(req, res){
			var query		= req.query;
			var filters		= [];

			if (!isUnd( filtersFN )) 
				filters = filtersFN( req );

			var limit		= (!isUnd( query.limit )) ? query.limit : 20;
			var skip		= (!isUnd( query.skip )) ? query.skip : 0;

			if (limit > 100) limit = 100;

			var find		= model
								.$find( filters )
								.limit( limit )
								.skip( skip )
								.sort( sort )
							;

			var count		= model.find( filters ).count();

			if (!isUnd( query.sort )) {
				var sort = {};

				sort[ query.sort ] = (!isUnd( query.order )) ? query.order : 1;

				find.sort( sort );
			}

			async.parallel(
				{
					result	: function(asyncCallback) {
						find.exec( asyncCallback );
					},
					count	: function(asyncCallback) {
						count.exec( asyncCallback );
					}
				},
				function(err, result) {
					if (err) {
						return res.json( 500, { success: false, error: err.toString(), result: null } )
					}

					result.success = true;

					return res.json( result );
				}
			);
		},
		view	: function(req, res) {
			model.$find({_id: req.params.id}, function(err, result) {
				if (err) {
					return res.json( 500, { success: false, error: err.toString(), result: null } )
				}
				
				if (!isUnd( result ) && result !== null && !isUnd( result[ 0 ] )) {
					result = result[ 0 ];

					return res.json( { success: true, result: result } );
				} else {
					return res.json( 404, { success: false, error: 'Not Found', result: null } );
				}
			});
		},
		create	: function(req, res) {
			model.$create( req.body, function(err, result) {
				if (err) {
					return res.json( 500, { success: false, error: err.toString(), result: null } )
				}

				return res.json( { success: true, result: result } );
			});
		},
		update	: function(req, res) {
			model.$update( req.body, function(err, result) {
				if (err) {
					return res.json( 500, { success: false, error: err.toString(), result: null } )
				}

				return res.json( { success: true, result: result } );
			});
		},
		delete	: function(req, res) {
			model.$delete( req.params.id, function(err, result) {
				if (err) {
					return res.json( 500, { success: false, error: err.toString(), result: null } )
				}

				return res.json( { success: true, result: result } );
			});
		}
	};
}

//TODO: move to utils
function isUnd( value ) {
	return typeof value === 'undefined';
}

module.exports = CrudControllerFactory;