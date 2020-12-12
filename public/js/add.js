var empCount = 1;

function addEmployeeField() {
    empCount++;
    var employeeContainer = document.getElementById('employee-container');
    var newTextfield = document.createElement('input');
    // <button type="button" id="add-employee" class="btn btn-primary align-content-between" onclick="add_fields();">
    newTextfield.setAttribute('type', 'text');
    newTextfield.setAttribute('class', 'form-control mb-2');
    newTextfield.setAttribute('name', 'employee['+ empCount-1 + '].name');
    newTextfield.setAttribute('placeholder', 'Mitarbeiter eintragen');

    employeeContainer.appendChild(newTextfield);
}

function addMilestoneField() {
    milestoneCount++;
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
var milestoneCount = 1;

function createTableColumn(type, property) {
    var newTableColumn = document.createElement('td');

    var newTextfield = document.createElement('input');
    newTextfield.setAttribute('type', type);
    newTextfield.setAttribute('class', 'form-control mb-1 mt-1');
    newTextfield.setAttribute('name', 'milestones['+ milestoneCount-1 + '].'+ property);
    newTextfield.setAttribute('placeholder', 'Bitte eintragen');
    newTableColumn.appendChild(newTextfield);

    return newTableColumn;
}
