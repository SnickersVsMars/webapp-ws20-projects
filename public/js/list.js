var overview = document.getElementById('card-container');
var template = document.getElementById('card-template');

HttpService.get('projects').done((projects) => {
    populateData(projects);
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
        card.querySelector('.project-milestone').innerHTML = validate(
            project.nextMilestone
        );
        card.querySelector('.project-customer').innerHTML = validate(
            project.customer
        );

        if (
            project.employees != null &&
            project.employees != undefined &&
            project.employees.length > 0
        )
            card.querySelector('.project-employees').innerHTML =
                project.employees.length;

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
