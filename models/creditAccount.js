const Sequelize = require('sequelize');
const db = require('../config/db');
const User = require('./user');

const CreditAccount = db.define('credit_account', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: Sequelize.UUID,
    credit_limit: Sequelize.FLOAT,
    available_credit: Sequelize.FLOAT,
    current_balance: {
        type: Sequelize.FLOAT,
        defaultValue: 0
    }
});

CreditAccount.belongsTo(User);

module.exports = CreditAccount;