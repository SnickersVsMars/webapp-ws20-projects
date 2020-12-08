var overview = document.getElementById('card-container');
var template = document.getElementById('card-template');

let projects;

HttpService.get('projects').done((projectsResult) => {
    projects = projectsResult;
    populateData(projectsResult);
});

function populateData(list) {
    removeProjects();

    $(list).each(function (i, project) {
        var card = template.content.cloneNode(true);
        card.querySelector('.project-number').innerHTML = validate(
            project.number
        );
        card.querySelector('.project-manager').innerHTML = validate(
            project.manager
        );

        card.querySelector('.project-label').innerHTML = validate(
            project.label
        );

        let nextMilestone = new Date(project.nextMilestone);

        card.querySelector('.project-milestone').innerHTML = formatDate(
            nextMilestone
        );

        card.querySelector('.project-customer').innerHTML = validate(
            project.customer
        );

        card.querySelector('.project-employees').innerHTML = validate(
            project.employeeCount
        );

        overview.appendChild(card);
        var cards = document.getElementsByClassName('card');
        cards[cards.length - 1].addEventListener('click', () =>
            showDetail(project.id)
        );
    });
    document.getElementById('busy-indicator').hidden = true;
}

$('#search-box').on('input', () => {
    let text = document.getElementById('search-box').value;

    if (text === '' || text === null || text === undefined) {
        populateData(result);
    }

    text = text.toLowerCase();
    result = projects.filter((project) => {
        return (
            project.label.toLowerCase().includes(text) ||
            project.manager.toLowerCase().includes(text) ||
            project.number.toLowerCase().includes(text) ||
            project.customer.toLowerCase().includes(text) ||
            formatDate(new Date(project.nextMilestone)).includes(text)
        );
    });
    populateData(result);
});

function filterProjects() {
    console.log(projects);
}

function showDetail(id) {
    location.href = 'projects/' + id;
}

function removeProjects() {
    while (overview.firstChild) {
        overview.removeChild(overview.firstChild);
    }
}
