const { User, DebitAccount, CreditAccount } = require('../models');

// Validar que el correo electrónico existe
const emailExists = async (email = '') => {
    const exists = await User.findOne({ where: { email }});

    if (exists) {
        throw new Error(`El correo: '${ email }' ya se encuentra registrado.`);     
    }
}

// Validar si el usuario existe por INE
const userExistsByINE = async (ine_id) => {
    const userExists = await User.findOne({ where: { ine_id }});
    
    if (userExists) {
        throw new Error(`El usuario ya se encuentra registrado, favor de revisar el ID de usuario.`);     
    }
}

// Consulta detalles de cuenta de crédito de usuario
const creditAccountDetails = async (account_id, user_id) => {
    const creditAccount = await CreditAccount.findOne({ where: { id: account_id, user_id }});
    return creditAccount;
}

// Consulta detalles de cuenta de débito de usuario
const debitAccountDetails = async (account_id, user_id) => {
    const debitAccount = await DebitAccount.findOne({ where: { id: account_id, user_id }});
    return debitAccount;
}

// Valida monto de operación del usuario
const validAmount = async (amount = 0) => {
    if(amount < 1) {    
        throw new Error(`El monto de la operación es incorrecto, por favor ingresa un nuevo monto.`);     
    }
}

// Valida cuenta de débito del usuario
const validateUserDebitAccount = async (uid, { req }) => {
    const { aid } = req.params;
    const debitAccountInfo = await debitAccountDetails(aid, uid);
    
    if (!debitAccountInfo) {    
        throw new Error(`Favor de verificar su ID de usuario o el número de cuenta de débito.`);     
    }
}

// Validar la el saldo del usuario con respecto a la cantidad que desea retirar en la cuenta de débito
const validateUserBalanceDebitAccount = async (uid, { req }) => {
    const { aid } = req.params;
    const { amount_withdraw } = req.body;
    const debitAccountInfo = await debitAccountDetails(aid, uid);
    
    if (debitAccountInfo && debitAccountInfo.balance < amount_withdraw) {
        throw new Error(`No cuentas con saldo suficiente para retirar esa cantidad, ingresa un nuevo monto.`);  
    }
}

// Valida cuenta de crédito del usuario
const validateUserCreditAccount = async (uid, { req }) => {
    const { aid } = req.params;
    const crediitAccountInfo = await creditAccountDetails(aid, uid);
    
    if (!crediitAccountInfo) {    
        throw new Error(`Favor de verificar su ID de usuario o el número de cuenta de crédito.`);     
    }
}

// Validar la el saldo del usuario con respecto a la cantidad que desea retirar en la cuenta de crédito, aplicando comisión
const validateUserBalanceCreditAccount = async (uid, { req }) => {
    const { aid } = req.params;
    const { amount_withdraw } = req.body;

    const crediitAccountInfo = await creditAccountDetails(aid, uid);
    
    const commission = amount_withdraw * 0.05; // Comisión por retiro, del 5%
    const totalWithdrawalAmount = amount_withdraw +  commission; // Total de deuda de retiro más comisión por retiro en cuenta de crédito
    
    if (crediitAccountInfo && crediitAccountInfo.available_credit < totalWithdrawalAmount) {
        throw new Error(`No cuentas con saldo suficiente para retirar esa cantidad, ingresa un nuevo monto.`);  
    }
}

// Valida el saldo (deudor) en la cuenta de crédito del usuario
const validateUserCreditAccountBalance = async (uid, { req }) => {
    const { aid } = req.params;
    const crediitAccountInfo = await creditAccountDetails(aid, uid);
    
    if (crediitAccountInfo.current_balance === 0) {    
        throw new Error(`Su saldo actual es 0, no se puede recibir el pago.`);     
    }
}

module.exports = {
    creditAccountDetails,
    debitAccountDetails,
    emailExists,
    userExistsByINE,
    validAmount,
    validateUserCreditAccount,
    validateUserDebitAccount,
    validateUserBalanceCreditAccount,
    validateUserBalanceDebitAccount,
    validateUserCreditAccountBalance
}