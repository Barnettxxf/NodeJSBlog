const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin
const sha1 = require('sha1')
const UserModel = require('../models/users')

// GET /signin 登陆页
router.get('/', checkNotLogin, function(req, res, next){
	res.render('signin')
})

// POST /sigin 用户登陆
router.post('/', checkNotLogin, function(req, res, next){
	const name = req.fields.name
	const password = req.fields.password

	try {
		if (!name.length) {
			throw new Error('请填写用户名')
		  }
		  if (!password.length) {
			throw new Error('请填写密码')
		  }
	} catch (error) {
		req.flash('error', error.message)
		return res.redirect('back')
	}

	UserModel.getUserByName(name)
		.then(function(user){
			if(!user){
				req.flash('error', '用户不存在')
				return res.redirect('back')
			}
			if(sha1(password) !== user.password){
				req.flash('error', '用户名或密码错误')
				return res.redirect('back')
			}
			req.flash('success', '登陆成功')
			delete user.password
			req.session.user = user
			res.redirect('/posts')
		})
		.catch(next)
})

module.exports = router