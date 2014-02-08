var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TheSchema = new Schema({
	model			: { type:  Schema.Types.ObjectId, ref: 'Model', required: true },
	year			: { type: Number, required: true },
	price			: { type: Number, required: true },
	description		: { type: String },
	gallery			: [
		{
			path		: { type: String },
			title		: { type: String },
			description	: { type: String },
			order		: { type: Number, default: 0 }
		}
	],
	color			: { type:  Schema.Types.ObjectId, ref: 'Color' },
	transmission	: { type: String, enum: [ 'Automatic', 'Mechanic' ] },
	components		: [
		{ type:  Schema.Types.ObjectId, ref: 'Component' }
	]
});

//###### STATICS: ######//
var Statics			= require( './core/statics' );

TheSchema.statics	= new Statics();

TheSchema.statics.$publicFields	= [ 
	'model',
	'year',
	'price',
	'description',
	'gallery',
	'color',
	'transmission',
	'components'
];

TheSchema.statics.$find = function $find(filters, callback) {
	return this.find( filters, callback )
		.populate( 'model' )
		.populate( 'color' )
		.populate( 'components' )
	;
}

//###### SET UP: ######//

mongoose.model('Vehicle', TheSchema);
