let overview = document.getElementById('card-container');
let template = document.getElementById('card-template');
let projects;

// initial load
buildFilterRow();

// on resize
window.addEventListener('resize', buildFilterRow);

$(document).ready(() => {
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
});

function populateData(list) {
    let numbers = [];
    let managers = [];
    let labels = [];
    let customers = [];

    $(list).each(function (i, project) {
        var card = template.content.cloneNode(true);
        card.querySelector('.project-number').innerText = validate(
            project.number
        );
        if (!numbers.includes(validate(project.number))) {
            numbers.push(validate(project.number));
        }

        card.querySelector('.project-manager').innerText = validate(
            project.manager
        );
        card.querySelector('.project-manager').title = validate(
            project.manager
        );
        if (!managers.includes(validate(project.manager))) {
            managers.push(validate(project.manager));
        }

        card.querySelector('.project-label').innerText = validate(
            project.label
        );
        card.querySelector('.project-label').title = validate(project.label);
        if (!labels.includes(validate(project.label))) {
            labels.push(validate(project.label));
        }

        let nextMilestone = new Date(project.nextMilestone);

        card.querySelector('.project-milestone').innerText = formatDate(
            nextMilestone
        );

        card.querySelector('.project-customer').innerText = validate(
            project.customer
        );
        card.querySelector('.project-customer').title = validate(
            project.customer
        );
        if (!customers.includes(validate(project.customer))) {
            customers.push(validate(project.customer));
        }

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

    createFilters(numbers, managers, labels, customers);

    // TODO why you not work?!
    $('[data-toggle="tooltip"]').tooltip();
}

function showDetail(id) {
    location.href = 'projects/' + id;
}

function buildFilterRow() {
    if ($('#filter-toggle-btn').is(':visible')) {
        $('#filter-container').addClass('collapse');
        $('#filter-container').children('div').removeClass('row');
        $('#filter-container').css('padding-left', '65px');
        $('#filter-row').css('justify-content', 'start');
    } else {
        $('#filter-container').removeClass('collapse');
        $('#filter-container').children('div').addClass('row');
        $('#filter-container').css('padding-left', 'unset');
        $('#filter-container').removeClass('collapse');
        $('#filter-row').css('justify-content', 'center');
    }

    $('#filter-toggle-btn').on('click', function () {
        if ($('#expander').text() === 'expand_more') {
            $('#expander').text('expand_less');
        } else {
            $('#expander').text('expand_more');
        }
    });
}

$('#filter-toggle-btn').on('visibilitychange', function () {
    console.log();
    if (document.visibilityState === 'visible') {
        console.log('visible');
    } else {
        console.log('not visible');
    }
});
