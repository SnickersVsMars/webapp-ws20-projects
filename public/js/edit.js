const split = window.location.href.split('/');
const id = split[split.length - 3];

HttpService.get('projects/' + id)
    .then((project) => {
        populateData(project);
    })
    .catch((res) => {
        if (res.status === 404 || res.status === 500) {
            let page = document.getElementsByTagName('html')[0];
            page.innerHTML = res.responseText;
        }
    });

function populateData(project) {
    document.getElementById('input-label').value = validate(project.label);
    document.getElementById('input-number').value = validate(project.number);

    setDescription(document.getElementById('input-description'), project.description);

    document.getElementById('input-manager').value = validate(project.manager);
    document.getElementById('input-customer').value = validate(project.customer);
    document.getElementById('input-costcenter').value = validate(
        project.costCenter
    );
    document.getElementById(
        'breadcrumb'
    ).innerText = `PROJEKT ${project.number}`;
    document
        .getElementById('breadcrumb')
        .setAttribute('href', '/projects/' + project.id);

    fillEmployess(project.employees);
    fillMilestones(project.milestones);

    document.getElementById('busy-indicator').hidden = true;
}
function addEmployeeField(value) {
    var employeeContainer = document.getElementById('employee-container');

    var newTextfield = document.createElement('input');
    newTextfield.setAttribute('type', 'text');
    newTextfield.setAttribute('class', 'form-control mb-2 input-employee');
    newTextfield.setAttribute('name', 'employees[][name]');
    newTextfield.setAttribute('required', true);
    newTextfield.setAttribute('maxlength', 100);
    newTextfield.setAttribute('placeholder', 'Name des Mitarbeiters');
    newTextfield.setAttribute('value', value);
    if (value === '' || undefined) {
        newTextfield.removeAttribute('value');
    }

    var removeButton = createRemoveButton('Mitarbeiter entfernen', (event) => {
        $(event.target).closest('.added-employee').remove();
    });

    var container = document.createElement('div');
    container.classList = 'added-employee';
    container.appendChild(removeButton);
    container.appendChild(newTextfield);

    employeeContainer.appendChild(container);
}


function fillEmployess(employees) {
    if (employees === null || employees === undefined || employees.length < 1)
        return;

    for (let i = 0; i < employees.length; i++) {
        addEmployeeField(employees[i].name);
    }
}

function fillMilestones(milestones) {
    if (
        milestones === null ||
        milestones === undefined ||
        milestones.length < 1
    )
        return;

    for (let i = 0; i < milestones.length; i++) {
        if (milestones[i].label === "Start" || milestones[i].label === "Projekt Start"){
            document.getElementById('start-date').value = milestones[i].date;
            setDescription(document.getElementById('start-description'), milestones[i].description);
        }
        if (milestones[i].label === "Ende" || milestones[i].label === "Projekt Ende" ){
            document.getElementById('end-date').value = milestones[i].date;
            setDescription(document.getElementById('end-description'), milestones[i].description);
        }
        if(milestones[i].label !== "Projekt Start" && milestones[i].label !== "Projekt Ende") {
            addMilestoneField(milestones[i].date, milestones[i].label, milestones[i].description);
        }

    }
}

function setDescription(element, description) {
    if (
        description === null ||
        description === undefined ||
        description === ''
    ) {
        element.innerHTML = '&ndash;';
    } else {
        element.innerText = description;
    }
}

function createRemoveButton(title, onclick) {
    let icon = document.createElement('i');
    icon.classList = 'material-icons';
    icon.innerText = 'remove';

    let buttonRemove = document.createElement('button');
    buttonRemove.setAttribute('type', 'button');
    buttonRemove.classList = 'btn btn-danger mt-1 mb-1 remove-button';
    buttonRemove.setAttribute('title', title);

    buttonRemove.appendChild(icon);

    buttonRemove.onclick = onclick;

    return buttonRemove;
}

function addMilestoneField(date, label, description) {
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
        null,
        date
    );
    cardBody.appendChild(dateColumn);

    var labelColumn = createFormGroup(
        'Bezeichnung',
        'input',
        'text',
        'label',
        'Meilenstein Bezeichnung',
        true,
        50,
        label
    );
    cardBody.appendChild(labelColumn);

    var descriptionColumn = createFormGroup(
        'Beschreibung',
        'textarea',
        null,
        'description',
        'Meilenstein Beschreibung',
        false,
        250,
        description
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
    maxlength,
    value
) {
    let formGroup = document.createElement('div');
    formGroup.classList = 'form-group col-sm-6';

    let label = document.createElement('label');
    label.innerText = labelString;
    formGroup.appendChild(label);

    let control = document.createElement(tag);
    control.setAttribute('class', 'form-control milestone-' + property);
    control.setAttribute('name', 'milestones[][' + property + ']');

    if (type) {
        control.setAttribute('type', type);
    }

    let validationMessage;

    if (isRequired) {
        control.setAttribute('required', true);
        validationMessage = 'Feld ist verpflichtend.';
    }

    if (maxlength > 1) {
        control.setAttribute('maxlength', maxlength);
        let maxlengthMessage = 'Maximal ' + maxlength + ' Zeichen';

        if (validationMessage != undefined) {
            validationMessage += ' ';
        }

        validationMessage += maxlengthMessage;
    }

    if (placeholder) {
        control.setAttribute('placeholder', placeholder);
    }

    if (value) {
        control.setAttribute('value', value);
    }

    formGroup.appendChild(control);

    if (validationMessage) {
        let feedback = document.createElement('div');
        feedback.classList = 'invalid-feedback';
        feedback.innerText = validationMessage;
        formGroup.appendChild(feedback);
    }

    return formGroup;
}

