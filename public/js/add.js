function addEmployeeField() {
    var employeeContainer = document.getElementById('employee-container');

    var newTextfield = document.createElement('input');
    newTextfield.setAttribute('type', 'text');
    newTextfield.setAttribute('class', 'form-control mb-2');
    newTextfield.setAttribute('name', 'employees[][name]');
    newTextfield.setAttribute('required', true);
    newTextfield.setAttribute('maxlength', 100);
    newTextfield.setAttribute('placeholder', 'Name des Mitarbeiters');

    var removeButton = createRemoveButton('Mitarbeiter entfernen', (event) => {
        $(event.target).closest('.added-employee').remove();
    });

    var container = document.createElement('div');
    container.classList = 'added-employee';
    container.appendChild(removeButton);
    container.appendChild(newTextfield);

    employeeContainer.appendChild(container);
}

function addMilestoneField() {
    let milestonesContainer = document.getElementById('milestone-container');

    let cardBody = document.createElement('div');
    cardBody.classList = 'card-body row';

    var dateColumn = createFormGroup(
        'Datum',
        'input',
        'date',
        'date',
        null,
        true,
        null
    );
    cardBody.appendChild(dateColumn);

    var labelColumn = createFormGroup(
        'Bezeichnung',
        'input',
        'text',
        'label',
        'Meilenstein Bezeichnung',
        true,
        50
    );
    cardBody.appendChild(labelColumn);

    var descriptionColumn = createFormGroup(
        'Beschreibung',
        'textarea',
        null,
        'description',
        'Meilenstein Beschreibung',
        false,
        250
    );
    cardBody.appendChild(descriptionColumn);

    var removeButton = createRemoveButton(
        'Milestone Zeile entfernen',
        (event) => {
            var cardBody = $(event.target).closest('.card-body');
            cardBody.prev('hr').remove();
            cardBody.remove();
        }
    );
    removeButton.classList = 'btn btn-danger d-block';
    let removeContainer = document.createElement('div');
    removeContainer.classList = 'col';
    let emptyLabel = document.createElement('label');
    emptyLabel.innerHTML = '&nbsp;';
    removeContainer.appendChild(emptyLabel);
    removeContainer.appendChild(removeButton);
    cardBody.append(removeContainer);

    milestonesContainer.appendChild(document.createElement('hr'));
    milestonesContainer.appendChild(cardBody);
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
    var formGroup = document.createElement('div');
    formGroup.classList = 'form-group col-sm-6';

    var label = document.createElement('label');
    label.innerText = labelString;
    formGroup.appendChild(label);

    var control = document.createElement(tag);

    control.setAttribute('class', 'form-control');
    control.setAttribute('name', 'milestones[][' + property + ']');

    if (type) {
        control.setAttribute('type', type);
    }

    if (isRequired) {
        control.setAttribute('required', true);
    }

    if (maxlength > 1) {
        control.setAttribute('maxlength', maxlength);
    }

    if (placeholder) {
        control.setAttribute('placeholder', placeholder);
    }

    formGroup.appendChild(control);

    return formGroup;
}

function createRemoveButton(title, onclick) {
    let icon = document.createElement('i');
    icon.classList = 'material-icons';
    icon.innerText = 'remove';

    let buttonRemove = document.createElement('button');
    buttonRemove.setAttribute('type', 'button');
    buttonRemove.classList = 'btn btn-danger mt-1 mb-1';
    buttonRemove.setAttribute('title', title);

    buttonRemove.appendChild(icon);

    buttonRemove.onclick = onclick;

    return buttonRemove;
}
