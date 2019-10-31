const router = require('express').Router();
const verifyToken = require('./verifyToken');

router.get('/', verifyToken, (req, res) => {
	return res.json({posts: { title: 'post', description: 'random private data'}, user: req.user});
});


module.exports = router;