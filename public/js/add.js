function addEmployeeField() {
    var employee_container = document.getElementById('employee-container');
    var new_textfield = document.createElement('input');
    // <button type="button" id="add-employee" class="btn btn-primary align-content-between" onclick="add_fields();">
    new_textfield.setAttribute('type', 'text');
    new_textfield.setAttribute('class', 'form-control mb-2');
    new_textfield.setAttribute('placeholder', 'Mitarbeiter eintragen');

    employee_container.appendChild(new_textfield);
}

function addMilestoneField() {
    var table_milestone_body = document.getElementById('table-milestone-body');
    var new_table_row = document.createElement('tr');

    var date_column = createTableColumn('date');
    new_table_row.appendChild(date_column);

    var label_column = createTableColumn('text');
    new_table_row.appendChild(label_column);

    var description_column = createTableColumn('text');
    new_table_row.appendChild(description_column);

    table_milestone_body.appendChild(new_table_row);
}

function createTableColumn(type) {
    var new_table_column = document.createElement('td');

    var new_textfield = document.createElement('input');
    new_textfield.setAttribute('type', type);
    new_textfield.setAttribute('class', 'form-control mb-1 mt-1');
    new_textfield.setAttribute('placeholder', 'Bitte eintragen');
    new_table_column.appendChild(new_textfield);

    return new_table_column;
}
