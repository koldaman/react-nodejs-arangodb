const createErrorWithCode = (code, message) => {
	return {code: code, error: true, message: message};
};

const createError = (message) => {
	return createErrorWithCode(-1, message);
};

const createErrorPromise = (error) => {
	return new Promise((resolve, reject) => {
		reject( createErrorWithCode(-1, error) );
	});
};

const createSimpleErrorPromise = (error) => {
	return new Promise((resolve, reject) => {
		reject( error );
	});
};

module.exports.createError = createError;
module.exports.createErrorWithCode = createErrorWithCode;
module.exports.createErrorPromise = createErrorPromise;
module.exports.createSimpleErrorPromise = createSimpleErrorPromise;