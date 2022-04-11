const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { validAmount, validateUserBalanceCreditAccount, validateUserBalanceDebitAccount, validateUserCreditAccount, validateUserCreditAccountBalance,validateUserDebitAccount } = require('../helpers');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { cashDepositDebitAccount, cashWithdrawalCreditAccount, cashWithdrawalDebitAccount, checkBalanceCreditAccount,checkBalanceDebitAccount,payCreditAccount } = require('../controllers/operation');

// Retiro de cuenta de débito
router.put('/debit/cash/withdrawal/user/:uid/account/:aid', [
    check('amount_withdraw', 'La cantidad que desea retirar no es válida, por favor ingrese la cantidad nuevamente.').isNumeric(),
    check('amount_withdraw').custom( validAmount ),
    check('uid').custom( (uid, req) => validateUserDebitAccount(uid, req) ),
    check('uid').custom( (uid, req) => validateUserBalanceDebitAccount(uid, req) ),
    fieldsValidator
], cashWithdrawalDebitAccount);

// Depósito cuenta de débito
router.put('/debit/cash/deposit/user/:uid/account/:aid', [
    check('amount_deposit', 'La cantidad que desea depositar no es válida, por favor intente de nuevo.').isNumeric(),
    check('amount_deposit').custom( validAmount ),
    check('uid').custom( (uid, req) => validateUserDebitAccount(uid, req) ),
    fieldsValidator    
], cashDepositDebitAccount);

// Retiro de cuenta de crédito
router.put('/credit/cash/withdrawal/user/:uid/account/:aid', [
    check('amount_withdraw', 'La cantidad que desea retirar no es válida, por favor intente de nuevo.').isNumeric(),
    check('amount_withdraw').custom( validAmount ),
    check('uid').custom( (uid, req) => validateUserCreditAccount(uid, req) ),
    check('uid').custom( (uid, req) => validateUserBalanceCreditAccount(uid, req) ),
    fieldsValidator    
], cashWithdrawalCreditAccount);

// Pagar por cuenta de crédito
router.put('/credit/pay/user/:uid/account/:aid', [
    check('amount_pay', 'La cantidad que desea abonar no es válida, por favor intente de nuevo.').isNumeric(),
    check('amount_pay').custom( validAmount ),
    check('uid').custom( (uid, req) => validateUserCreditAccount(uid, req) ),
    check('uid').custom( (uid, req) => validateUserCreditAccountBalance(uid, req) ),
    fieldsValidator    
], payCreditAccount);

// Consultar saldo en estado cuenta
router.get('/credit/check/status/user/:uid/account/:aid', [
    check('uid').custom( (user_id, req) => validateUserCreditAccount(user_id, req) ),
    fieldsValidator    
], checkBalanceCreditAccount);

// Consultar saldo en estado cuenta
router.get('/debit/check/status/user/:uid/account/:aid', [
    check('uid').custom( (user_id, req) => validateUserDebitAccount(user_id, req) ),
    fieldsValidator    
], checkBalanceDebitAccount);

module.exports = router;

