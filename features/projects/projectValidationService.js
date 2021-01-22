const { body, validationResult } = require('express-validator');

let validationArray = [
    body('manager')
        .trim()
        .notEmpty()
        .withMessage('Bitte Namen der zuständigen Person eintragen')
        .isLength({ max: 50 })
        .withMessage('Maximale Länge überschritten'),

    body('customer')
        .trim()
        .notEmpty()
        .withMessage('Bitte Namen des Kunden eintragen')
        .isLength({ max: 50 })
        .withMessage('Maximale Länge überschritten'),

    body('label')
        .trim()
        .notEmpty()
        .withMessage('Bitte Bezeichnung eintragen')
        .isLength({ max: 50 })
        .withMessage('Maximale Länge überschritten'),

    body('costCenter')
        .trim()
        .notEmpty()
        .withMessage('Bitte zuständige Kostenstelle eintragen')
        .isLength({ max: 20 })
        .withMessage('Maximale Länge überschritten'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Maximale Länge überschritten'),

    body('employees.*.name')
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage('Maximale Länge überschritten'),

    body('milestones.*.label')
        .trim()
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage('Maximale Länge überschritten'),

    body('milestones.*.description')
        .optional()
        .trim()
        .isLength({ max: 250 })
        .withMessage('Maximale Länge überschritten'),

    body('milestones.*.date')
        .trim()
        .notEmpty()
        .withMessage('Bitte Datum eintragen')
        .matches(/^(199\d|20\d{2})-(0\d|1(0|1|2))-(0\d|1\d|2\d|3(0|1|))$/)
        .withMessage(
            'Format nicht korrekt, bitte Format JJJJ-MM-TT verwenden. Eingabedatum muss zwischen 1990-01-01 und 2099-12-31 liegen.'
        ),

    body('milestones').custom((value) => {
        let startDate;
        let endDate;

        for (let i = 0; i < value.length; i++) {
            if (value[i].label === 'Projekt Start') {
                startDate = value[i].date;
            }

            if (value[i].label === 'Projekt Ende') {
                endDate = value[i].date;
            }
        }

        if (startDate == undefined || endDate == undefined) {
            throw '"Projekt Start" und "Projekt Ende" Meilensteine sind verplichtend';
        }

        if (startDate > endDate) {
            throw 'Meilenstein "Projekt Start" muss vor Meilenstein "Projekt Ende" liegen';
        }

        return true;
    }),
];

function validate(req, res) {
    const errorFormatter = ({ param, msg }) => {
        return `${msg}`;
    };
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        let errorsMapped = errors.mapped();

        return res.status(400).json({ errors: errorsMapped });
    }
}

module.exports = { validationArray, validate };
