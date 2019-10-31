const dbConfig = require('../config/db');
const arangojs = require('arangojs');
const aqlQuery = arangojs.aql;
const DB = new arangojs.Database({ // Database connection
		url: dbConfig.url
});
// const { registerValidation, registerGoogleValidation } = require('../validation/user');
const { createSimpleErrorPromise, createErrorPromise } = require('../utils/error');

// Database selection
DB.useDatabase(dbConfig.database);

// Specify the database user
DB.useBasicAuth(dbConfig.username, dbConfig.password);

// Collection to manage
var collection = DB.collection('invoice');

/*
exports.create = user => {
	const { error } = registerValidation(user);

	if (error) return createErrorPromise(error.details[0].message);

	user.source = 'application';

	return userCollection.save(user).catch(e => {
		return createSimpleErrorPromise(e.response.body);
	});
};

exports.createGoogle = user => {
	const { error } = registerGoogleValidation(user);

	if (error) return createErrorPromise(error.details[0].message);

	// move id to _key
	user._key = user.id;
	user.id = null;
	user.source = 'google';

	return userCollection.save(user).catch(e => {
		return createSimpleErrorPromise(e.response.body);
	});
};

exports.findByEmail = email => {
	if (!email) return createErrorPromise('E-mail not specified');

	return userCollection.firstExample({email: email}).catch(e => {
		return createSimpleErrorPromise(e.response.body);
	});
};

exports.findByKey = key => {
	if (!key) return createErrorPromise('Key not specified');

	return userCollection.firstExample({_key: key}).catch(e => {
		return createSimpleErrorPromise(e.response.body);
	});
};
*/

exports.queryList = (page=1, results=10, sortField='nr', sortOrder='asc', filters=[]) => {
	let query = 'FOR doc IN @@collection';
	let params = {
		'@collection' : collection.name,
		offset: (page-1) * results,
		count: results,
		sortField,
		sortOrder: sortOrder.startsWith('desc') ? 'desc' : 'asc',
	};
	if (filters.length) {
		for (let i = 0; i < filters.length; i++) {
			if (i === 0) {
				query += " FILTER";
			} else {
				query += " &&";
			}
			query += " REGEX_TEST(doc.@filterName" + i + ", @filterValue" + i + ", true)";
			params['filterName'+i] = filters[i].name;
			params['filterValue'+i] = filters[i].value;
		}
		// query += " FILTER REGEX_TEST(doc.@filterField, @filterValue, true)";
	}
	if (sortField) {
		query += " SORT doc.@sortField @sortOrder";
	}
	if (results) {
		query += " LIMIT @offset, @count";
	}
	query += " RETURN doc";

	console.log('AQL', query);
	console.log('Params', params);

	return DB.query(query, params, {count:true, options:{fullCount:true} }).catch(e => {
		return createSimpleErrorPromise(e.response.body);
	});
};
