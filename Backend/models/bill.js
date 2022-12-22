const mongoose = require('mongoose')
const Schema = mongoose.Schema


// Bill Schema
const BillSchema = new Schema({
	receipt_no: 	{type: String, required: true},
	time: 			{ type: Date, default: Date.now },
	payment_method: { type: String, required:true },
	cash: 			{ type: Number, default: 0 },
	quantity: 		[{
						item_name: {type: String, required: true},
						price_each: {type: Number, required: true},
						quantity: {type: Number, required: true},
						item: {type: Schema.Types.ObjectId, ref:'Item'}
					}],
	user_id: 		{type: Schema.Types.ObjectId, ref:'User'}
})


module.exports = mongoose.model("Bill", BillSchema)