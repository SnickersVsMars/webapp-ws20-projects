const split = window.location.href.split('/');
const id = split[split.length - 3];

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
    $('#input-label').val(validate(project.label));
    $('#input-number').val(validate(project.number));
    setDescription($('#input-description'), project.description);
    $('#input-manager').val(validate(project.manager));
    $('#input-customer').val(validate(project.customer));
    $('#input-cost-center').val(validate(project.costCenter));
    $('#last-change-text').text(formatDate(project.lastChanged));
    $('#breadcrumb').text(`PROJEKT ${project.number}`);
    $('#breadcrumb').attr('href', '/projects/' + project.id);

    console.log(project.description);

    fillEmployees(project.employees);
    fillMilestones(project.milestones);

    $('#projectId').val(id);

    $('#busy-indicator').hide();
}

function fillEmployees(employees) {
    if (employees === null || employees === undefined || employees.length < 1)
        return;

    for (let i = 0; i < employees.length; i++) {
        addEmployeeField(employees[i].name, employees[i].id);
    }
}

function fillMilestones(milestones) {
    if (
        milestones === null ||
        milestones === undefined ||
        milestones.length < 1
    )
        return;

    for (let i = 0; i < milestones.length; i++) {
        if (milestones[i].label === 'Projekt Start') {
            $('#start-date').val(milestones[i].date);
            $('#start-id').val(milestones[i].id);
            setDescription($('#start-description'), milestones[i].description);
        }
        if (milestones[i].label === 'Projekt Ende') {
            $('#end-date').val(milestones[i].date);
            $('#end-id').val(milestones[i].id);
            setDescription($('#end-description'), milestones[i].description);
        }
        if (
            milestones[i].label !== 'Projekt Start' &&
            milestones[i].label !== 'Projekt Ende'
        ) {
            addMilestoneField(
                milestones[i].date,
                milestones[i].label,
                milestones[i].description,
                milestones[i].id
            );
        }
    }
}
