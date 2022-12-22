const express = require('express')  
const passport = require('passport')
const User = require('../models/user')

const router = express.Router()


// register
router.post('/register', (req, res, next) => {
	const { username, password, store_name, address, f_name, l_name, email, tax_id, promptpay_number } = req.body;
	const this_user = new User({
		username: username,
		store_name: store_name,
		address: address,
		f_name: f_name,
		l_name: l_name,
		email: email,
		tax_id: tax_id,
		promptpay_number: promptpay_number
	})
	User.register(this_user, password, (err) => {
		console.log('check!')
		if (err) {
			return res.status(400).json(err)
		}
		return res.json({'message': 'successfully created account'})
		
	})
})


// login
router.post('/login', passport.authenticate('local'), (req, res) => {
	return res.json({'message': `successfully login as (${req.user.username})`})
})


router.post('/logout', (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(400).json(err)
		}
		return res.json({'message': 'successfully logged-out'})
	})
})


// middleware isLoggedIn func
function isLoggedIn (req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).json({'message': 'not logged-in'})
	} else {
		return next()
	}
}


// is logged in check
router.get('/is_logged_in_check', isLoggedIn, (req, res, next) => {
	return res.json({'message': `logged-in as (${req.user.username})`})
})


// get user id
router.get('/user_id', isLoggedIn, (req, res, next) => {
	return res.json({"user_id": `${req.user._id}`})
})


// get all user info
router.get('/user', isLoggedIn, (req, res, next) => {
	return res.json(req.user)
})


// edit user info
router.put('/edit', isLoggedIn, (req, res, next) => {
	const user_info = {
		// username: req.body.username,   ** can't edit username
		store_name: 		req.body.store_name,
		address: 			req.body.address,
		f_name: 			req.body.f_name,
		l_name: 			req.body.l_name,
		email: 				req.body.email,
		tax_id: 			req.body.tax_id,
		promptpay_number: 	req.body.promptpay_number
	}

	User.findOneAndUpdate({'_id': req.user._id}, user_info, (err, suc) => {
		if (err) {
			return res.status(400).json(err)
		}
		return res.end()
	})
})


// change password
router.put('/password', isLoggedIn, (req, res, next) => {
	let { old_password, new_password } = req.body
	if (old_password == null || new_password == null) {
		return res.status(400).json({message: "required 'old_password' and 'new_password'"})
	}
	User.findOne({'_id': req.user._id}).then((u) => {
		u.changePassword(old_password, new_password, (err, u) => {
			if (err) return res.status(400).json(err)
			u.save()
			return res.json({message: "password changed"})
		})
	})
})


// delete account
router.delete('/user', isLoggedIn, (req, res, next) => {
	User.findOneAndUpdate({'_id': req.user._id}, {username: "deactivate_" + req.user.username + Math.floor((Math.random() * 100) + 1)}, (err, suc) => {
		if (err) {
			return res.status(400).json(err)
		}
		req.logout((err) => {
			if (err) {
				return res.status(400).json(err)
			}
			return res.json({'message': 'successfully deleted account'})
		})
	})
})


module.exports = router
module.exports.isLoggedIn = isLoggedIn






