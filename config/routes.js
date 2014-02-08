module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	app.get('/', home.index);

	//admin:
	var admin = require('../app/controllers/admin');
	app.get( '/admin', admin.index );
	app.get( '/admin/:module', admin.module );
	app.post( '/admin/:model/create', admin.create );
	app.post( '/admin/:model/update/:id', admin.update );
	app.get( '/admin/:model/delete/:id', admin.delete );

	//API:
	var models = [ 'make', 'model', 'color', 'component', 'vehicle' ];

	for(var i in models) {
		var name		= models[ i ];
		var controller	= require( '../app/controllers/' + name );

		app.get( '/api/' + name, controller.index );
		app.post( '/api/' + name, controller.create );
		app.get( '/api/' + name + '/:id', controller.view );
		app.post( '/api/' + name + '/:id', controller.update );
		app.delete( '/api/' + name + '/:id', controller.delete );
	}
};
