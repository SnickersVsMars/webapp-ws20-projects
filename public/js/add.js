function addEmployeeField() {
    var employeeContainer = document.getElementById('employee-container');

    var newTextfield = document.createElement('input');
    newTextfield.setAttribute('type', 'text');
    newTextfield.setAttribute('class', 'form-control mb-2 input-employee');
    newTextfield.setAttribute('name', 'employees[][name]');
    newTextfield.setAttribute('required', true);
    newTextfield.setAttribute('maxlength', 100);
    newTextfield.setAttribute('placeholder', 'Name des Mitarbeiters');

    var removeButton = createRemoveButton('Mitarbeiter entfernen');

    var container = document.createElement('div');
    container.classList = 'added-employee';
    container.appendChild(removeButton);
    container.appendChild(newTextfield);

    employeeContainer.appendChild(container);
}

function addMilestoneField() {
    var tableMilestoneBody = document.getElementById('table-milestone-body');
    var newTableRow = document.createElement('tr');

    var removeButton = createRemoveButton('Milestone Zeile entfernen');
    let column = document.createElement('th');
    column.appendChild(removeButton);
    newTableRow.append(column);

    var dateColumn = createTableColumn(
        'input',
        'date',
        'date',
        null,
        true,
        null
    );
    newTableRow.appendChild(dateColumn);

    var labelColumn = createTableColumn(
        'input',
        'text',
        'label',
        'Meilenstein Bezeichnung',
        true,
        50
    );
    newTableRow.appendChild(labelColumn);

    var descriptionColumn = createTableColumn(
        'textarea',
        null,
        'description',
        'Meilenstein Beschreibung',
        false,
        250
    );
    newTableRow.appendChild(descriptionColumn);

    tableMilestoneBody.appendChild(newTableRow);
}

function createTableColumn(
    tag,
    type,
    property,
    placeholder,
    isRequired,
    maxlength
) {
    var column = document.createElement('td');

    var control = document.createElement(tag);

    control.setAttribute(
        'class',
        'form-control mb-1 mt-1 milestone-' + property
    );
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

    column.appendChild(control);

    return column;
}

function createRemoveButton(title) {
    let icon = document.createElement('i');
    icon.classList = 'material-icons';
    icon.innerText = 'remove';

    let buttonRemove = document.createElement('button');
    buttonRemove.setAttribute('type', 'button');
    buttonRemove.classList = 'btn btn-danger mt-1 mb-1 remove-button';
    buttonRemove.setAttribute('title', title);

    buttonRemove.appendChild(icon);

    buttonRemove.onclick = (event) => {
        $(event.target).parent().remove();
    };

    return buttonRemove;
}
