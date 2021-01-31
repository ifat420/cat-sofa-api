const { MoleculerError } = require("moleculer").Errors;

class EntityNotFound extends MoleculerError {
	constructor(msg, data) {
		super(msg || "The requested entity does not exist.", 400, "ENTITY_NOT_EXIST", data);
	}
}

class NotFound extends MoleculerError {
	constructor(msg, data) {
		super(msg || "The requested data is not found.", 404, "NOT_FOUND", data);
	}
}

class PermissionDenied extends MoleculerError {
	constructor(msg, data) {
		super(msg || "You don't have the permission.", 403, "PERMISSION_DENIED", data);
	}
}

class DuplicateKeyError extends MoleculerError {
	constructor(msg, data) {
		super(msg || "Your key is not unique.", 409, "DUPLICATE_KEY", data);
	}
}

class Unauthorized extends MoleculerError {
	constructor(msg, data) {
		super(msg || "Invalid Token", 401, "INVALID_TOKEN", data);
	}
}

class AlreadyRegistered extends MoleculerError {
	constructor(msg, data) {
		super(msg || "Already Registered", 409, "ALREADY_REGISTERED", data);
	}
}

class NotAlumni extends MoleculerError {
	constructor(msg, data) {
		super(msg || "Not Alumni", 400, "NOT_ALUMNI", data);
	}
}

class LimitExceed extends MoleculerError {
	constructor(msg, data) {
		super(msg || "Limit Exceeded", 429, "LIMIT_EXCEEDED", data);
	}
}
class UnprocessableEntity extends MoleculerError {
	constructor(msg, data) {
		super(msg || "Unsupported Media Type", 422, "LIMIT_EXCEEDED", data);
	}
}


module.exports = { Unauthorized, PermissionDenied, EntityNotFound, DuplicateKeyError, NotFound, AlreadyRegistered, NotAlumni, LimitExceed, UnprocessableEntity };
