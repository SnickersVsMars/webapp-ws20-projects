var overview = document.getElementById('card-container');
var template = document.getElementById('card-template');

let projects;

HttpService.get('projects')
    .then((projectsResult) => {
        projects = projectsResult;
        populateData(projectsResult);
    })
    .catch((res) => {
        if (res.status === 404 || res.status === 500) {
            let page = document.getElementsByTagName('html')[0];
            page.innerHTML = res.responseText;
        }
    });

function populateData(list) {
    removeProjects();

    $(list).each(function (i, project) {
        var card = template.content.cloneNode(true);
        card.querySelector('.project-number').innerText = validate(
            project.number
        );
        card.querySelector('.project-manager').innerText = validate(
            project.manager
        );

        card.querySelector('.project-label').innerText = validate(
            project.label
        );

        let nextMilestone = new Date(project.nextMilestone);

        card.querySelector('.project-milestone').innerText = formatDate(
            nextMilestone
        );

        card.querySelector('.project-customer').innerText = validate(
            project.customer
        );

        card.querySelector('.project-employees').innerText = validate(
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
