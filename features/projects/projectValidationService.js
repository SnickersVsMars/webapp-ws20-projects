const { body, validationResult, check } = require('express-validator');

var validationArray = [
    body('number')
        .notEmpty()
        .withMessage('Bitte Feld ausfüllen')
        .matches(/PR\d{2}_\d{4}/)
        .withMessage('Bitte folgendes Format verwenden: PR20_xxxx')
        .trim()
        .isLength({ max: 20 })
        .withMessage('Maximale Länge überschritten'),
    body('manager')
        .notEmpty()
        .withMessage('Bitte Namen der zuständigen Person eintragen')
        .trim()
        .isLength({ max: 50 })
        .withMessage('Maximale Länge überschritten'),
    body('customer')
        .notEmpty()
        .withMessage('Bitte Namen des Kunden eintragen')
        .trim()
        .isLength({ max: 20 }),
    body('costcenter')
        .notEmpty()
        .withMessage('Bitte zuständige Kostenstelle eintragen')
        .trim()
        .isLength({ max: 20 })
        .withMessage('Maximale Länge überschritten'),
    body('label')
        .notEmpty()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Maximale Länge überschritten'),
    body('description')
        .trim()
        .isLength({ max: 250 })
        .withMessage('Maximale Länge überschritten'),
    body('employees.*.name')
        .trim()
        .isLength({ max: 100 })
        .withMessage('Maximale Länge überschritten'),
    body('milestones.*.label')
        .trim()
        .isLength({ max: 50 })
        .withMessage('Maximale Länge überschritten'),
    body('milestones.*.description')
        .trim()
        .isLength({ max: 250 })
        .withMessage('Maximale Länge überschritten'),
    body('milestones.*.date')
        .matches(/\d{4}-\d{2}-\d{2}/)
        .withMessage('Format nicht korrekt, bitte JJJJ-MM-TT verwenden')
        .trim()
        .isLength({ max: 20 })
        .withMessage('Maximale Länge überschritten'),
];

function validate(req, res) {
    const errorFormatter = ({ param, msg }) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return ` ${msg}`;
    };
    const errors = validationResult(req).formatWith(errorFormatter);
    // const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.mapped() });
    }
}

module.exports = { validationArray, validate };

//json anders aufbauen
/*fehler meldungen in einem array zusammenfassen

{
    "key": "number",
    "msg": ["Invalid value",
    "message 2"
    ]

} */
