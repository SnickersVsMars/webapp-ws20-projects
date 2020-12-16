const split = window.location.href.split('/');
const id = split[split.length - 1];

HttpService.get('projects/' + id).done((project) => {
    populateData(project);
});

function populateData(project) {
    document.getElementById('label').innerHTML = validate(project.label);
    document.getElementById('number').innerHTML = validate(project.number);

    setDescription(document.getElementById('description'), project.description);

    document.getElementById('manager').innerHTML = validate(project.manager);
    document.getElementById('customer').innerHTML = validate(project.customer);
    document.getElementById('costCenter').innerHTML = validate(
        project.costCenter
    );
    document.getElementById(
        'breadcrumb'
    ).innerHTML = `PROJEKT ${project.number}`;
    document
        .getElementById('breadcrumb')
        .setAttribute('href', '/projects/' + project.id);

    fillEmployess(project.employees);
    fillMilestones(project.milestones);

    document.getElementById('busy-indicator').hidden = true;
}

function fillEmployess(employees) {
    if (employees === null || employees === undefined || employees.length < 1)
        return;

    let ul = document.getElementById('employees');

    for (let i = 0; i < employees.length; i++) {
        // Create the list item:
        let item = document.createElement('li');
        // item.className="list-group-item"

        // Set its contents:
        item.innerText = employees[i].name;

        // Add it to the list:
        ul.appendChild(item);
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
    tbody.innerHTML = '';

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (let i = 0; i < milestones.length; i++) {
        let tr = tbody.insertRow();

        if (milestones[i].date === null || milestones[i].date === undefined)
            tr.insertCell().innerHTML = validate(null);
        else tr.insertCell().innerHTML = formatDate(milestones[i].date);

        tr.insertCell().innerHTML = validate(milestones[i].label);
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
