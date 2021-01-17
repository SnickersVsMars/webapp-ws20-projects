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
    $('#costCenter').text(validate(project.costCenter));
    $('#breadcrumb').text(`PROJEKT ${project.number}`);
    $('#breadcrumb').attr('href', '/projects/' + project.id);

    fillEmployess(project.employees);
    fillMilestones(project.milestones);

    $('#busy-indicator').hide();
}

function fillEmployess(employees) {
    if (employees === null || employees === undefined || employees.length < 1)
        return;

    for (let i = 0; i < employees.length; i++) {
        let $employee = $('<li>').text(employees[i].name);
        $('#employees').append($employee);
    }
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

function setDescription($el, description) {
    if (
        description === null ||
        description === undefined ||
        description === ''
    ) {
        $el.html('&ndash;');
    } else {
        $el.text(description);
    }
}
