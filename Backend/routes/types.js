const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('./auth')

const ItemType = require('../models/item_type')
const Item = require('../models/item')


router.use(isLoggedIn)


// add type
router.post('/', (req, res, next) => {
	const { type_name } = req.body;

	const item = new ItemType({
		type_name: type_name,
		user_id: req.user._id
	});

	ItemType.findOne({'type_name': type_name, user_id: req.user._id}, (err, result) => {
		if (err) {
			res.status(400).json(err)
		}
		if (result) {
			res.status(409).json({'message': 'type_name is already exists'})
		} else {
			item.save((err) => {
				if (err) {
					res.status(400).json(err)
				}
		    	res.end()
			})
		}
	})

	
});


// get type list
router.get('/', (req, res, next) => {
	ItemType.find({'user_id': req.user._id}, (err, data) => {
		if (err) {
			res.status(400).json(err)
		}
		res.json(data)
	})
})


// get one type by id
router.get('/:type_id', (req, res, next) => {
	const type_id = req.params['type_id'];

	ItemType.findOne({'_id': type_id, 'user_id': req.user._id}, (err, data) => {
		if (err) {
			res.status(400).json(err)
		}
		res.json(data)
	})
})


// delete type
router.delete('/:type_id', (req, res, next) => {
	const type_id = req.params['type_id'];

	ItemType.deleteOne({'_id': type_id, 'user_id': req.user._id}, (err, data) => {
		if (err) {
			res.status(400).json(err)
		}
		Item.updateMany({'type_id': type_id}, {'type_id': null}, (err, data) => {
			if (err) {
				return res.status(400).json(err)
			}
			return res.json(data)
		})
	})
})


router.get('/name/:type_name', (req, res, next) => {
	const type_name = req.params['type_name'];

	ItemType.findOne({'type_name': type_name, 'user_id': req.user._id}, (err, data) => {
		if (err) {
			res.status(400).json(err)
		}
		res.json(data)
	})
})


router.post('/edit/:old_name/:new_name', (req, res, next) => {
	const {old_name, new_name} = req.params

	ItemType.findOne({'type_name': new_name, user_id: req.user._id}, (err, result) => {
		if (err) {
			res.status(400).json(err)
		}
		if (result) {
			res.status(409).json({'message': 'type_name is already exists'})
		} else {
			ItemType.findOneAndUpdate({'type_name': old_name, 'user_id': req.user._id}, {'type_name': new_name}, (err, suc) => {
				if (err) {
					return res.status(400).json(err)
				}
				return res.end()
			})
		}
	})
})


module.exports = router