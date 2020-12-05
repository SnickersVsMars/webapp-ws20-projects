function addEmployeeField() {

    var employee_container = document.getElementById('employee-container');
    var new_textfield = document.createElement("input");
    // <button type="button" id="add-employee" class="btn btn-primary align-content-between" onclick="add_fields();">
    new_textfield.setAttribute("type", "text");
    new_textfield.setAttribute("class", "form-control mb-2");
    new_textfield.setAttribute("placeholder", "Mitarbeiter eintragen");

    employee_container.appendChild(new_textfield);
}

function addMilestoneField() {
    var table_milestone_body = document.getElementById('table-milestone-body');
    var new_table_row = document.createElement("tr");

    for (var i = 0; i < 3; i++) {
        var new_table_1 = document.createElement("td");
        var new_textfield = document.createElement("input");
        new_textfield.setAttribute("type", "input");
        new_textfield.setAttribute("class", "form-control mb-2");
        new_textfield.setAttribute("placeholder", "Bitte eintragen");
        new_table_1.appendChild(new_textfield);
        new_table_row.appendChild(new_table_1);
    }
    table_milestone_body.appendChild(new_table_row);

    var new_button = document.createElement("button");
    new_button.setAttribute("type", "button");
    new_button.setAttribute("class", "btn btn-primary");
    new_button.setAttribute("onclick", "addMilestoneField()");
    new_button.innerHTML = '<i class="material-icons ">add</i>';

    new_button.appendChild(new_button);


}


