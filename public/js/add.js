function addEmployeeField() {
    let $empInput = $('<input>');
    $empInput.addClass('form-control mb-2 input-employee');
    $empInput.attr('type', 'text');
    $empInput.attr('name', 'employees[][name]');
    $empInput.attr('required', true);
    $empInput.attr('maxlength', 100);
    $empInput.attr('placeholder', 'Name des Mitarbeiters');

    let $removeButton = createRemoveButton('Mitarbeiter entfernen', (event) => {
        $(event.target).closest('.added-employee').remove();
    });

    $('#employee-container').append(
        $('<div class="added-employee">').append($removeButton, $empInput)
    );
}

function addMilestoneField() {
    let $cardBody = $('<div class="card-body row">');

    let $dateColumn = createFormGroup(
        'Datum',
        'input',
        'date',
        'date',
        null,
        true,
        null
    );
    $cardBody.append($dateColumn);

    let $labelColumn = createFormGroup(
        'Bezeichnung',
        'input',
        'text',
        'label',
        'Meilenstein Bezeichnung',
        true,
        50
    );
    $cardBody.append($labelColumn);

    let $descriptionColumn = createFormGroup(
        'Beschreibung',
        'textarea',
        null,
        'description',
        'Meilenstein Beschreibung',
        false,
        250
    );
    $cardBody.append($descriptionColumn);

    let $removeButton = createRemoveButton('Meilenstein entfernen', (event) => {
        let $body = $(event.target).closest('.card-body');
        $body.prev('hr').remove();
        $body.remove();
    });

    $removeButton.addClass('btn btn-danger d-block');

    $cardBody.append(
        $('<div class="col">').append(
            $('<label>').html('&nbsp;'),
            $removeButton
        )
    );

    $('#milestone-container').append($('<hr>'), $cardBody);
}

function createFormGroup(
    labelString,
    tag,
    type,
    property,
    placeholder,
    isRequired,
    maxlength
) {
    let $formGroup = $('<div class="form-group col-sm-6">');

    $formGroup.append($('<label>').text(labelString));

    let $control = $('<' + tag + '>');
    $control.addClass('form-control milestone-' + property);
    $control.attr('name', 'milestones[][' + property + ']');

    if (type) {
        $control.attr('type', type);
    }

    let validationMessage;

    if (isRequired) {
        $control.attr('required', true);
        validationMessage = 'Feld ist verpflichtend.';
    }

    if (maxlength > 1) {
        $control.attr('maxlength', maxlength);
        let maxlengthMessage = 'Maximal ' + maxlength + ' Zeichen';

        if (validationMessage != undefined) {
            validationMessage += ' ';
        }

        validationMessage += maxlengthMessage;
    }

    if (placeholder) {
        $control.attr('placeholder', placeholder);
    }

    $formGroup.append($control);

    if (validationMessage) {
        $formGroup.append(
            $('<div class="invalid-feedback">').text(validationMessage)
        );
    }

    return $formGroup;
}

function createRemoveButton(title, onclick) {
    let $buttonRemove = $('<button>');
    $buttonRemove.addClass('btn btn-danger mt-1 mb-1 remove-button');
    $buttonRemove.attr('type', 'button');
    $buttonRemove.attr('title', title);

    $buttonRemove.append($('<i class="material-icons">').text('remove'));

    $buttonRemove.click((e) => onclick(e));

    return $buttonRemove;
}
