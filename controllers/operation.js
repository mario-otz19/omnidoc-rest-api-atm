const { debitAccountDetails, creditAccountDetails, returnResponse } = require('../helpers');

// Retiro en cuenta de débito
exports.cashWithdrawalDebitAccount = async (req, res) => {
    try {
        const { aid, uid } = req.params;
        const { amount_withdraw } = req.body;
        // const { account_id: id, amount_withdraw } = req.body;
        const debitAccountInfo = await debitAccountDetails(aid, uid);

        const previousBalance = debitAccountInfo.balance;
        debitAccountInfo.balance = previousBalance - amount_withdraw;        
        const { balance } = await debitAccountInfo.save();

        const responseData = {
            msg: 'Retiro de cuenta de débito terminado.',
            data: {
                aid,
                previos_balance: previousBalance,
                amount_withdraw,
                current_balance: balance
            }
        };

        returnResponse(res, 200, responseData);
    } 
    
    catch (error) {
        returnResponse(res, 500, '');
    }
}

// Depósito en cuenta de débito
exports.cashDepositDebitAccount = async (req, res) => {
    try {
        const { aid, uid } = req.params;
        const { amount_deposit } = req.body;
        const debitAccountInfo = await debitAccountDetails(aid, uid);

        const previousBalance = debitAccountInfo.balance;
        debitAccountInfo.balance = previousBalance + amount_deposit;        
        const { balance } = await debitAccountInfo.save();

        const responseData = {
            msg: 'Depósito a cuenta de débito',
            data: {
                aid,
                previos_balance: previousBalance,
                amount_deposit,
                current_balance: balance
            }
        };

        returnResponse(res, 200, responseData);
    } 
    
    catch (error) {
        returnResponse(res, 500, '');
    }
}

// Retiro en cuenta de crédito
exports.cashWithdrawalCreditAccount = async (req, res) => {
    try {
        const { aid, uid } = req.params;
        const { amount_withdraw } = req.body;
        const creditAccountInfo = await creditAccountDetails(aid, uid);
        const { available_credit, credit_limit, current_balance } = creditAccountInfo;
        let commission = 0; // Comisión por retiro, inicial
        let totalWithdrawalAmount = 0;
        let positiveBalance = 0;

        if (available_credit > credit_limit) {
            positiveBalance = available_credit - credit_limit;

            if (positiveBalance > amount_withdraw) {
                positiveBalance = available_credit - credit_limit - amount_withdraw;
                totalWithdrawalAmount = amount_withdraw + commission; // Total de deuda de retiro más comisión 0% por retiro en cuenta de crédito
                creditAccountInfo.available_credit = available_credit - totalWithdrawalAmount;
            }

            else {
                positiveBalance = 0;
                commission = (amount_withdraw - positiveBalance) * 0.05;
                totalWithdrawalAmount = (amount_withdraw - positiveBalance) + commission; // Total de deuda de retiro más comisión 5% por retiro en cuenta de crédito en lo que exceda
                creditAccountInfo.available_credit = credit_limit - totalWithdrawalAmount;
                creditAccountInfo.current_balance = current_balance + totalWithdrawalAmount;
            }
        }

        else {
            commission = amount_withdraw * 0.05;
            totalWithdrawalAmount = amount_withdraw + commission; // Total de deuda de retiro más comisión 5% por retiro en cuenta de crédito
            creditAccountInfo.available_credit = available_credit - totalWithdrawalAmount; // Total de deuda de retiro más comisión por retiro en cuenta de crédito 
            creditAccountInfo.current_balance = current_balance + totalWithdrawalAmount;   
        }

        const currentInfoCreditAccount = await creditAccountInfo.save();

        const responseData = { 
            msg: 'Retiro de cuenta de crédito',
            data: {
                credit_limit,
                available_credit: currentInfoCreditAccount.available_credit,
                positive_balance: positiveBalance,
                amount_withdraw,
                withdrawal_fee: commission,
                current_balance: currentInfoCreditAccount.current_balance
            }
        }
        
        returnResponse(res, 200, responseData);
    } 
    
    catch (error) {
        returnResponse(res, 500, '');
    }
}

exports.payCreditAccount = async (req, res) => {
    try {
        const { aid, uid } = req.params;
        const { amount_pay } = req.body;
        const creditAccountInfo = await creditAccountDetails(aid, uid);
        
        const { available_credit, credit_limit, current_balance } = creditAccountInfo;
        creditAccountInfo.available_credit = available_credit + amount_pay;
        creditAccountInfo.current_balance = (current_balance < amount_pay) ? 0 : (current_balance - amount_pay);
        const currentInfoCreditAccount = await creditAccountInfo.save();
        const positiveBalance = (currentInfoCreditAccount.current_balance === 0) ? (currentInfoCreditAccount.available_credit - credit_limit) : 0;

        const responseData = { 
            msg: 'Pago por cuenta de crédito',
            data: {
                credit_limit,
                available_credit: currentInfoCreditAccount.available_credit,
                positive_balance: positiveBalance,
                amount_pay,
                current_balance: currentInfoCreditAccount.current_balance
            }
        }

        returnResponse(res, 200, responseData);
    } 
    
    catch (error) {
        returnResponse(res, 500, '');
    }
}

exports.checkBalanceCreditAccount = async (req, res) => {
    try {
        const { aid, uid } = req.params;
        const creditAccountInfo = await creditAccountDetails(aid, uid);
        const { available_credit, credit_limit, current_balance } = creditAccountInfo;
        const positiveBalance = (available_credit > credit_limit) ? (available_credit - credit_limit) : 0;

        const responseData = { 
            msg: 'Consulta detalles en cuenta de crédito',
            data: {
                credit_limit,
                available_credit,
                positive_balance: positiveBalance,
                current_balance
            }
        }

        returnResponse(res, 200, responseData);
    } 
    
    catch (error) {
        returnResponse(res, 500, '');
    }
}

exports.checkBalanceDebitAccount = async (req, res) => {
    try {
        const { aid, uid } = req.params;
        const debitAccountInfo = await debitAccountDetails(aid, uid);
        const { balance } = debitAccountInfo;

        const responseData = { 
            msg: 'Consulta detalles en cuenta de crédito',
            data: {
                balance
            }
        }

        returnResponse(res, 200, responseData);
    } 
    
    catch (error) {
        returnResponse(res, 500, '');
    }
}