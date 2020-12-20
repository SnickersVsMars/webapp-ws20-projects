const split = window.location.href.split('/');
const id = split[split.length - 1];

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
    document.getElementById('label').innerText = validate(project.label);
    document.getElementById('number').innerText = validate(project.number);

    setDescription(document.getElementById('description'), project.description);

    document.getElementById('manager').innerText = validate(project.manager);
    document.getElementById('customer').innerText = validate(project.customer);
    document.getElementById('costCenter').innerText = validate(
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
