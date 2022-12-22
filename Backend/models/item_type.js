const mongoose = require('mongoose')
const Schema = mongoose.Schema


// ItemType Schema
const ItemTypeSchema = new Schema({
	type_name: 	{type: String, required:true},
	user_id: 	{type: Schema.Types.ObjectId, ref:'User', required:true}
})


module.exports = mongoose.model("ItemType", ItemTypeSchema)