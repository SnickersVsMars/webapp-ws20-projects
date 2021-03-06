const split = window.location.href.split('/');
const id = split[split.length - 1];

$('#download-pdf').attr('href', window.location.href + '/export');

HttpService.get('projects/' + id)
    .then((project) => {
        populateData(project);
    })
    .catch((res) => {
        if (res.status === 404 || res.status === 500) {
            $('html').html(res.responseText);
        }
    });

function populateData(project) {
    $('#label').text(validate(project.label));
    $('#number').text(validate(project.number));
    setDescription($('#description'), project.description);
    $('#manager').text(validate(project.manager));
    $('#customer').text(validate(project.customer));
    $('#cost-center').text(validate(project.costCenter));
    setLastChanged($('#last-change-text'), project.lastChanged);
    $('#breadcrumb').text(`PROJEKT ${project.number}`);
    $('#breadcrumb').attr('href', '/projects/' + project.id);

    fillEmployees(project.employees);
    fillMilestones(project.milestones);
    fillFiles(project.files);
    $('#project_id').val(project.id);
    $('#busy-indicator').hide();
    $('#edit').on('click', () => showDetail(project.id));

    $('body').append('<div id="load-finished"></div>');
}

function fillEmployees(employees) {
    if (employees === null || employees === undefined || employees.length < 1)
        return;

    for (let i = 0; i < employees.length; i++) {
        $('#employees').append($('<li>').text(employees[i].name));
    }
}

function fillFiles(files) {
    if (files === null || files === undefined || files.length < 1) return;

    for (let i = 0; i < files.length; i++) {
        addFile(files[i]);
    }
}

function addFile(file) {
    $('#tr-files-empty').hide();

    let $tbody = $('#table-files-body')[0];
    let $tr = $tbody.insertRow();
    $tr.id = 'tr-file-' + file.id;

    let $col = $tr.insertCell();
    $col.innerText = validate(file.filename);

    let $buttons = $('#action-buttons-template')[0].content.cloneNode(true);

    $buttons.querySelector('.openBtn').href =
        '../api/projects/download/' + file.id;
    $buttons.querySelector('.openBtn').download = file.filename;

    $buttons.querySelector('.deleteBtn').onclick = function (e) {
        e.preventDefault();

        if (confirm('Wollen Sie die Datei wirklich löschen?')) {
            HttpService.delete('projects/deleteFile/' + file.id).done(function (
                resp,
                status
            ) {
                if (status === 'success') {
                    $trDelete = $('#tr-file-' + file.id)[0];
                    $tbody.removeChild($trDelete);

                    if ($tbody.children.length < 2) {
                        $('#tr-files-empty').show();
                    }
                }
            });
        }
    };
    let $col2 = $tr.insertCell();
    $col2.appendChild($buttons);
}

function fillMilestones(milestones) {
    if (
        milestones === null ||
        milestones === undefined ||
        milestones.length < 1
    )
        return;

    let $tbody = $('#table-milestone-body');
    $tbody.text('');

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (let i = 0; i < milestones.length; i++) {
        let date;

        if (milestones[i].date === null || milestones[i].date === undefined) {
            date = validate(null);
        } else {
            date = formatDate(milestones[i].date);
        }

        let $description = $('<td>');
        setDescription($description, milestones[i].description);

        $tbody.append(
            $('<tr>').append(
                $('<td>').text(date),
                $('<td>').text(milestones[i].label),
                $description
            )
        );
    }
}

function showDetail(id) {
    location.href = id + '/edit/';
}
