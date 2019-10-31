const router = require('express').Router();
const invoiceService = require('../services/invoice');
const util = require('util');
const { createError } = require('../utils/error');
const verifyToken = require('./verifyToken');

router.get('/', verifyToken, async (req, res) => {
	try {
		console.log('Request: ' +  JSON.stringify(req.query));
		let info = {
			page: req.query.page ? parseInt(req.query.page) : 1,
			results: req.query.results ? parseInt(req.query.results) : 10
		};

		let filters = getQueryParams(req.query, ['customer', 'status', 'nr']);

		const result = await invoiceService.queryList(
			info.page,
			info.results,
			req.query.sortField,
			req.query.sortOrder,
			filters
		);
		info.count = result.count;
		info.fullCount = result.extra.stats.fullCount;

		console.log('Result: ' +  JSON.stringify(result));
		return res.status(200).json({info, result: result._result});
	} catch (e) {
		console.error('Error: ', e);
		return res.status(400).json(e);
	}
});

function getQueryParams(query, names) {
	var filters = [];
	for (let i = 0; i < names.length; i++) {
		const name = names[i];
		const values = query[name];
		if (values) {
			for (let j = 0; j < values.length; j++) {
				filters.push({name: name, value: values[j]});
			}
		}
	}
	return filters;
}

module.exports = router;