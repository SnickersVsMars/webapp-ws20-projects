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

    for (let i = 0; i < files.length; i++) {
        addFile(files[i]);
    }
}

function addFile(file) {
    if(!$('#tr-files-empty').hasClass("hide"))
    {
        $('#tr-files-empty').addClass("hide");
    }

    let tbody = $('#table-files-body')[0];
    let tr = tbody.insertRow();
    tr.id = "tr-file-"+file.id;

    let col = tr.insertCell();     
    col.innerText = validate(file.filename);

    let buttons = $('#action-buttons-template')[0].content.cloneNode(true);
    
    buttons.querySelector('.openBtn').href = '../api/projects/download/'+file.id;
    buttons.querySelector('.openBtn').download = file.filename;
    
    buttons.querySelector('.deleteBtn').onclick = function(e) {
        e.preventDefault();
        jQuery.ajax({
			method: 'DELETE',
			url: '/api/projects/deleteFile/'+file.id
		})
		.done(function (resp, status) {
            if (status==="success") {
                trDelete = $('#tr-file-'+file.id)[0];
                tbody.removeChild(trDelete);

                if(tbody.children.length < 2 && $('#tr-files-empty').hasClass("hide"))
                {
                    $('#tr-files-empty').removeClass("hide");
                }
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
