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

   // let ul = document.getElementById('employees');

    for (let i = 0; i < employees.length; i++) {
        addEmployeeField(employees[i].name);
        // Create the list item:
       // let item = document.createElement('li');
        // item.className="list-group-item"

        // Set its contents:
       // item.innerText = employees[i].name;

        // Add it to the list:
        //ul.appendChild(item);
    }
}

function fillMilestones(milestones) {
    if (
        milestones === null ||
        milestones === undefined ||
        milestones.length < 1
    )
        return;

    let tbody = document.getElementById('table-milestone-body');
    tbody.innerText = '';

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (let i = 0; i < milestones.length; i++) {
        let tr = tbody.insertRow();

        if (milestones[i].date === null || milestones[i].date === undefined)
            tr.insertCell().innerText = validate(null);
        else tr.insertCell().innerText = formatDate(milestones[i].date);

        tr.insertCell().innerText = validate(milestones[i].label);
        setDescription(tr.insertCell(), milestones[i].description);
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

