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
    fillFiles(project.files);
    document.getElementById('project_id').value = project.id;

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

function fillFiles(files) {
    if (
        files === null ||
        files === undefined ||
        files.length < 1
    )
        return;

    let tbody = document.getElementById('table-files-body');
    tbody.innerText = '';

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (let i = 0; i < files.length; i++) {
        let tr = tbody.insertRow();
        addFile(files[i]);
    }
}

function addFile(file) {
    let tbody = document.getElementById('table-files-body');
    let tr = tbody.insertRow();
    tr.classList.add("tr-file-"+file.id);

    let col = tr.insertCell();     
    col.innerText = validate(file.filename);

    let buttons = document.getElementById('action-buttons-template').content.cloneNode(true);
    
    buttons.querySelector('.openBtn').onclick = function(e) {
        e.preventDefault();  //stop the browser from following
        window.location.href = '../download/'+file.id;
    };
    buttons.querySelector('.deleteBtn').onclick = function(e) {
        e.preventDefault();  //stop the browser from following
        jQuery.ajax({
			method: 'DELETE',
			url: '/deleteFile/'+file.id
		})
		.done(function (resp, status) {
            if (status==="success") {
                let trDelete = tbody.querySelector('.tr-file-'+file.id);
                tbody.removeChild(trDelete);
            }
		});
    };
    let col2 = tr.insertCell();   
    col2.appendChild(buttons);
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
