const router = require('express').Router();
const userService = require('../services/user');
const util = require('util');
const { createError } = require('../utils/error');
const bcrypt = require('bcryptjs');
const { loginValidation, loginGoogleValidation } = require('../validation/user');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
	const userData = req.body;

	try {
		// check user is already registered
		const emailExist = await userService.findByEmail(userData.email);
		if (emailExist) return res.status(400).send(createError('E-mail exists'));
	} catch (e) {
		console.log('E-mail does not exists - OK');
	}

	// hash the password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(userData.password, salt);
	userData.password = hashPassword;

	try {
		const created = await userService.create(userData);
		console.log('Saved: ' +  created._key);
		// const loaded = await userService.findByKey(created._key);
		return res.status(200).json(created);
	} catch (e) {
		console.error('Error saving: ', e);
		return res.status(400).json(e);
	}

});

router.post('/registerGoogle', async (req, res) => {
	const userData = req.body;

	try {
		// check user is already registered
		const emailExist = await userService.findByEmail(userData.email);
		if (emailExist) return res.status(409).send(createError('E-mail exists'));
	} catch (e) {
		console.log('E-mail does not exists - OK');
	}

	try {
		const created = await userService.createGoogle(userData);
		console.log('Saved: ' +  created._key);
		// const loaded = await userService.findByKey(created._key);
		return res.status(200).json(created);
	} catch (e) {
		console.error('Error saving: ', e);
		return res.status(400).json(e);
	}

});

router.post('/login', async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).json(createError(error.details[0].message));

	// check user is already exists
	let user;
	try {
		user = await userService.findByEmail(req.body.email);
	} catch (e) {
		return res.status(400).json(createError('E-mail does not exists!')); // just for debugging - add vague message later
	}

	// password is correct
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.status(400).json(createError('Invalid password!')); // just for debugging - add vague message later

	// hide password from returning back
	user.password = '*****';

	// create and assign JWT
	const token = await jwt.sign({_id: user._key}, process.env.TOKEN_SECRET);

	return res.header('auth-token', token).send(user);
});

router.post('/loginGoogle', async (req, res) => {
	const { error } = loginGoogleValidation(req.body);
	if (error) return res.status(400).json(createError(error.details[0].message));

	// check user exists
	let user;
	try {
		user = await userService.findByEmail(req.body.email);
		if (user._key !== req.body.id) {
			throw new Error("Wrong google id");
		}
	} catch (e) {
		return res.status(400).json(createError('This gmail user does not exists!'));
	}

	// create and assign JWT
	const token = await jwt.sign({_id: user._key}, process.env.TOKEN_SECRET);

	return res.header('auth-token', token).send(user);
});

module.exports = router;