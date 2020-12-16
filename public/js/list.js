var overview = document.getElementById('card-container');
var template = document.getElementById('card-template');

HttpService.get('projects')
    .then((projects) => {
        populateData(projects);
    })
    .catch((res) => {
        if (res.status === 404 || res.status === 500) {
            let page = document.getElementsByTagName('html')[0];
            page.innerHTML = res.responseText;
        }
    });

function populateData(projects) {
    $(projects).each(function (i, project) {
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

function showDetail(id) {
    location.href = 'projects/' + id;
}
