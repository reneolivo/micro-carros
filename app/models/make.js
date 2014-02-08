var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var TheSchema = new Schema({
	name	: { type: String, required: true, unique: true },
	logo	: { type: String }
});


//###### STATICS: ######//
var Statics			= require( './core/statics' );

TheSchema.statics	= new Statics();

TheSchema.statics.$publicFields	= [ 'name', 'logo' ];

TheSchema.statics.$cleanObject = function( obj ) {
	var data = Statics.prototype.$cleanObject.apply( this, [ obj ] );

	if (!this.$isObjectId( data.logo )) {
		data.logo = null;
	}

	return data;
}

TheSchema.statics.$find = function $find(filters, callback) {
	return this.find( filters, callback ).populate( 'logo' );
}

//###### SET UP: ######//

mongoose.model( 'Make', TheSchema );
