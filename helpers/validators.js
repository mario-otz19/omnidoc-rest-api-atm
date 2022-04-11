// Validar el saldo inicial
const validateInitialBalance = async(balance) => {     
    if (balance <= 1000) {
        throw new Error(`El saldo inicial debe ser mayor a $,1000.00 MXN.`);     
    }
}

module.exports = {
    validateInitialBalance
}