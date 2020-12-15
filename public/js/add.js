function addEmployeeField() {
    var employeeContainer = document.getElementById('employee-container');
    var newTextfield = document.createElement('input');
    newTextfield.setAttribute('type', 'text');
    newTextfield.setAttribute('class', 'form-control mb-2');
    newTextfield.setAttribute('name', 'employees[][name]');
    newTextfield.setAttribute('placeholder', 'Name des Mitarbeiters');

    employeeContainer.appendChild(newTextfield);
}

function addMilestoneField() {
    var tableMilestoneBody = document.getElementById('table-milestone-body');
    var newTableRow = document.createElement('tr');

    var dateColumn = createTableColumn('date', 'date');
    newTableRow.appendChild(dateColumn);

    var labelColumn = createTableColumn('text', 'label');
    newTableRow.appendChild(labelColumn);

    var descriptionColumn = createTableColumn('text', 'description');
    newTableRow.appendChild(descriptionColumn);

    tableMilestoneBody.appendChild(newTableRow);
}

function createTableColumn(type, property) {
    var newTableColumn = document.createElement('td');

    var newTextfield = document.createElement('input');
    newTextfield.setAttribute('type', type);
    newTextfield.setAttribute('class', 'form-control mb-1 mt-1');
    newTextfield.setAttribute('name', 'milestones[][' + property + ']:string');
    if (property === 'label') {
        newTextfield.setAttribute('placeholder', 'Meilenstein Bezeichnung');
    } else if (property === 'description') {
        newTextfield.setAttribute('placeholder', 'Meilenstein Beschreibung');
    }
    newTableColumn.appendChild(newTextfield);

    return newTableColumn;
}
