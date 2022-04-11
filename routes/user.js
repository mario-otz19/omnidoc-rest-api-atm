const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { registerUser } = require('../controllers');
const { emailExists, userExistsByINE, validateInitialBalance } = require('../helpers');

router.post('/', [
    check(['name', 'surname'], 'El nombre es obligatorio, debe escribir nombre completo.').not().isEmpty(),
    check('password', 'La contraseña es obligatoria.').not().isEmpty(),
    check('password', 'La contraseña debe tener por lo menos 8 caracteres.').isLength({ min: 8 }),
    check('username', 'El nombre de usuario no debe ir vacío.').not().isEmpty(),
    check('email', 'El correo electrónico no es válido').isEmail(),
    check('date_birth', 'La fecha de nacimiento es obligatoria.').not().isEmpty(),
    check('date_birth', 'El formato de fecha de nacimiento no es correcto.').isDate({ format: 'YYYY-MM-DD' }),
    check('ine_id', 'El identificador de INE es obligatorio.').not().isEmpty(),
    check('ine_id', 'Sólo se aceptan números para el INE.').isNumeric(),
    check('balance', 'El saldo ingresado no es correcto.').isNumeric(),
    check('email').custom( emailExists ),
    check('ine_id').custom( userExistsByINE ), 
    check('balance').custom( validateInitialBalance ), 
    fieldsValidator
], registerUser);

module.exports = router;