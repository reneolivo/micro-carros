var mongoose = require( 'mongoose' );



function Statics() {

}

Statics.prototype.$isObjectId = function $isObjectId(id) {
	var regexp = new RegExp("^[0-9a-fA-F]{24}$");

	return regexp.test( id );
}

Statics.prototype.$cleanObject = function $cleanObject(object) {
	var publicFields = this.$publicFields;

	if ( !Array.isArray( publicFields )) throw new Error( 'Public Fields not defined correctly' );

	var data = {};
	for(var i in publicFields) {
		var field = publicFields[ i ];

		if (typeof object[ field ] !== 'undefined') {
			data[ field ] = object[ field ];
		}
	}

	return data;
}

Statics.prototype.$create = function $create(object, callback) {
	var data 		= this.$cleanObject( object );

	this.create( data, callback );
}

Statics.prototype.$update = function $update(object, callback) {
	var self		= this;
	
	if (typeof callback !== 'function') callback = function() {};

	//console.log('FIND: ', object);
	self.findOne({ _id : object._id }, function(err, result) {
		//console.log('RESULT: ',err, result)
		if (err) return callback( err, null );
		if (result === null) return callback( new Error( 'document not found' ), null );

		var data 	= self.$cleanObject( object );
		//	data	= data.toObject();

		delete data._id;

		self.update( {_id: object._id }, data, callback );
	});
}

Statics.prototype.$delete = function $delete(ObjectId, callback) {
	var self		= this;
	
	if (typeof callback !== 'function') callback = function() {};

	self.findOne({ _id : ObjectId }, function(err, result) {
		if (err) return callback( err, null );
		if (result === null) return callback( new Error( 'document not found' ), null );

		result.remove( callback );
	});
}

module.exports = Statics;