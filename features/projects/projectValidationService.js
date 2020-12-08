//json kommt rein zur validierung

//input name = key

//array nach außen, validation wird beschrieben
var validationArray = [
    // username must be an email
    body('username').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 })
];
function validate (req, res) {
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
}
}

modules.export = {validationArray, validate}
