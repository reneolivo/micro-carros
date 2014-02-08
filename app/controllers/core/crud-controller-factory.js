var async = require('async');

function CrudControllerFactory(model) {
	return {
		model	: model,
		index	: function(req, res){
			var query		= req.query;
			var filters		= {};

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
						return res.json( { success: false, error: err.toString(), result: null } )
					}

					result.success = true;

					return res.json( result );
				}
			);
		},
		create	: function(req, res) {
			model.$create( req.body, function(err, result) {
				if (err) {
					return res.json( { success: false, error: err.toString(), result: null } )
				}

				return res.json( { success: true, result: result } );
			});
		},
		update	: function(req, res) {
			model.$update( req.body, function(err, result) {
				if (err) {
					return res.json( { success: false, error: err.toString(), result: null } )
				}

				return res.json( { success: true, result: result } );
			});
		},
		delete	: function(req, res) {
			model.$delete( req.params.id, function(err, result) {
				if (err) {
					return res.json( { success: false, error: err.toString(), result: null } )
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