const jwt = require('jsonwebtoken');
const { createErrorWithCode } = require('../utils/error');

module.exports = function (req, res, next) {
	const token = req.header('auth-token');
	if (!token) return res.status(401).send(createErrorWithCode(401, "Access denied!"));
	try {
		const verified = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = verified;
		next();
	} catch (e) {
		return res.status(401).send(createErrorWithCode(401, "Invalid JWT token!"));
	}
};