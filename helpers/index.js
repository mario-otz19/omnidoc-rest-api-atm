const dbValidators = require('./dbValidators');
const { returnResponse } = require('./returnResponse');
const validators = require('./validators');

module.exports = {
    ...dbValidators,
    returnResponse,
    ...validators
}