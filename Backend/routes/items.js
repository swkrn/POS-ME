const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('./auth')

const User = require('../models/user')
const Item = require('../models/item')
const ItemType = require('../models/item_type')


router.use(isLoggedIn)


// add item
router.post('/', (req, res, next) => {
	const { barcode, name, price, description, type_id } = req.body;

	const item = new Item({
		barcode: barcode,
		name: name,
		price: price,
		description: description,
		type_id: type_id,
		user_id: req.user._id
	});

	Item.findOne({'barcode': barcode, user_id: req.user._id}, (err, result) => {
		if (err) {
			return res.status(400).json(err)
		}
		if (result) {
			return res.status(409).json({'message': 'barcode of this item is already exists'})
		} else {
			item.save((err) => {
				if (err) {
					return res.status(400).json(err)
				}
	    		return res.end()
			})
		}
	})
});


// get item list
router.get('/', (req, res, next) => {
	Item.find({'user_id': req.user._id}, (err, data) => {
		if (err) {
			return res.status(400).json(err)
		}
		return res.json(data)
	})
})


// get one item by id
router.get('/:item_id', (req, res, next) => {
	const item_id = req.params['item_id'];

	Item.findOne({'_id': item_id, 'user_id': req.user._id}, (err, data) => {
		if (err) {
			return res.status(400).json(err)
		}
		return res.json(data)
	})
})


// get one item by barcode
router.get('/barcode/:barcode', (req, res, next) => {
	const barcode = req.params['barcode'];

	Item.findOne({'barcode': barcode, 'user_id': req.user._id}, (err, data) => {
		if (err) {
			return res.status(400).json(err)
		}
		return res.json(data)
	})
})


// delete item by id
router.delete('/:item_id', (req, res, next) => {
	const item_id = req.params['item_id'];

	Item.deleteOne({'_id': item_id, 'user_id': req.user._id}, (err, data) => {
		if (err) {
			return res.status(400).json(err)
		}
		return res.json(data)
	})
})


// update item by id
router.put('/:item_id', (req, res, next) => {
	const item_id = req.params['item_id'];

	const item = {
		barcode: req.body.barcode,
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
		type_id: req.body.type_id
	}

	Item.findOne({'barcode': req.body.barcode, user_id: req.user._id}, (err, result) => {
		if (err) {
			return res.status(400).json(err)
		}
		if (result) {
			if (item_id == result._id) {
				Item.findOneAndUpdate({'_id': item_id, 'user_id': req.user._id}, item, (err, suc) => {
					if (err) {
						return res.status(400).json(err)
					}
					return res.end()
				})
			} else {
				return res.status(409).json({'message': 'barcode of this item is already exists'})
			}
		} else {
			Item.findOneAndUpdate({'_id': item_id, 'user_id': req.user._id}, item, (err, suc) => {
			    if (err) {
			    	return res.status(400).json(err)
			    }
			    return res.end()
			})
		}
	})
})


//search and filter type
router.post('/filter', (req, res, next) => {
	let { keyword, type_id } = req.body

	console.log("keyword: " + keyword)
	console.log("type_id: " + type_id)

	if (keyword == undefined) {
		keyword = ""
	}

	if (type_id == undefined || type_id == null) {
		Item.find(
			{
				$or:[
					{'name': { "$regex": keyword, "$options": "i" }}, 
					{'barcode': { "$regex": keyword, "$options": "i" }}
				],
				'user_id': req.user._id
			},
			(err, data) => {
				if (err) {
					return res.status(400).json(err)
				}
				return res.json(data)
			}
		)
	} else {
		Item.find(
			{
				$or:[
					{'name': { "$regex": keyword, "$options": "i" }}, 
					{'barcode': { "$regex": keyword, "$options": "i" }}
				],
				'user_id': req.user._id,
				'type_id': type_id	
			},
			(err, data) => {
				if (err) {
					return res.status(400).json(err)
				}
				return res.json(data)
			}
		)
	}
})
	    

module.exports = router