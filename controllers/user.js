const { CreditAccount, DebitAccount, User } = require('../models');
const { returnResponse } = require('../helpers');

exports.registerUser = async(req, res) => {
    try {   
        const { balance, ...rest } = req.body;
        const user = await User.create(rest);
        const user_id = user.id;

        const { id, balance: initalBalance } = await DebitAccount.create({ user_id, balance });
        const creditAccount = await CreditAccount.create({  user_id, credit_limit: balance, available_credit: balance });
        const { available_credit, credit_limit, current_balance } = creditAccount;
        
        const responseData = {
            msg: 'Se ha registrado un nuevo usuario.',
            data: {
                user_id,
                debit_account: {
                    id,
                    balance: initalBalance
                },
                credit_account: {
                    id: creditAccount.id,
                    available_credit,
                    credit_limit,
                    current_balance
                }
            }
        } 

        returnResponse(res, 200, responseData);
    }
    
    catch (error) {
        returnResponse(res, 500, '');
    }
}