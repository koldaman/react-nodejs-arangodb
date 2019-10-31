const dbConfig = require('../config/db');
const arangojs = require('arangojs');
const DB = new arangojs.Database({ // Database connection
		url: dbConfig.url
});
const { registerValidation, registerGoogleValidation } = require('../validation/user');
const { createSimpleErrorPromise, createErrorPromise } = require('../utils/error');

// Database selection
DB.useDatabase(dbConfig.database);

// Specify the database user
DB.useBasicAuth(dbConfig.username, dbConfig.password);

// Collection to manage
var userCollection = DB.collection('user');

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

