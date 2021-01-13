let overview = document.getElementById('card-container');
let template = document.getElementById('card-template');
let projects;

$('#search-box').val('');

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

function createFilters(numbers, managers, labels, customers) {
    createFilter(numbers, 'number-filter');
    createFilter(managers, 'manager-filter');
    createFilter(labels, 'label-filter');
    createFilter(customers, 'customer-filter');
}

function createFilter(list, id) {
    $(list).each(function (i, val) {
        if (val === '&ndash;') {
            val = '-';
        }
        $('#' + id).append(
            `<div class="custom-control custom-checkbox dropdown-item">
                <input type="checkbox"
                       class="custom-control-input"
                       id="${id}-${i}">
                <label class="custom-control-label"
                       id="${id}-${i}-label"
                       for="${id}-${i}">
                </label>
            </div>`
        );
        $(`#${id}-${i}-label`).text(val);
    });
}

$('#search-box').on('input', function () {
    let text = $(this).val().toLowerCase();

    $('#card-container .card').filter(function () {
        $(this).toggle($(this).text().toLowerCase().includes(text));
    });
});

$('.dropdown-menu').on('click', function (e) {
    e.stopPropagation();
});

function filterProjects() {
    console.log(projects);
}

function showDetail(id) {
    location.href = 'projects/' + id;
}
