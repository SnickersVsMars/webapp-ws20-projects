const { body, validationResult } = require('express-validator');

var validationArray = [
    body('number')
        .trim()
        .notEmpty()
        .withMessage('Bitte Projektnummer eintragen')
        .matches(/PR\d{2}-\d{4}/)
        .withMessage('Bitte folgendes Format verwenden: PR20_xxxx')
        .isLength({ max: 20 })
        .withMessage('Maximale Länge überschritten'),

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
        .withMessage('Bitte Beschreibung eintragen')
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
        .matches(/\d{4}-\d{2}-\d{2}/)
        .withMessage('Format nicht korrekt, bitte JJJJ-MM-TT verwenden'),

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
        var errorsMapped = errors.mapped();

        return res.status(400).json({ errors: errorsMapped });
    }
}

module.exports = { validationArray, validate };
