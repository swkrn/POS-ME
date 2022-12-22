const mongoose = require('mongoose')
const Schema = mongoose.Schema


// Item Schema
const ItemSchema = new Schema({
	barcode: 		{type: String, required:true},
	name: 			{type: String, required:true},
	price: 			{type: Number, required:true},
	description: 	{type: String},
	//ref
	type_id: 		{type: Schema.Types.ObjectId, ref:'ItemType', default: null},
	user_id: 		{type: Schema.Types.ObjectId, ref:'User', required:true}
})


module.exports = mongoose.model("Item", ItemSchema)