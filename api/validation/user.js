const Joi = require('@hapi/joi');


const registerValidation = data => {
	const schema = Joi.object ({
		name: Joi.string().min(4).required(),
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required()
	});
	return schema.validate(data);
};

const registerGoogleValidation = data => {
	const schema = Joi.object ({
		id: Joi.string().min(6).required(),
		name: Joi.string().min(4).required(),
		email: Joi.string().min(6).required().email(),
		imageUrl: Joi.string()
	});
	return schema.validate(data);
};


const loginValidation = data => {
	const schema = Joi.object ({
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required()
	});
	return schema.validate(data);
};

const loginGoogleValidation = data => {
	const schema = Joi.object ({
		id: Joi.string().min(6).required(),
		email: Joi.string().min(6).required().email()
	});
	return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.registerGoogleValidation = registerGoogleValidation;
module.exports.loginValidation = loginValidation;
module.exports.loginGoogleValidation = loginGoogleValidation;