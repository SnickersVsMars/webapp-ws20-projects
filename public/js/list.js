let projects;

// initial load
buildFilterRow();

// on resize
window.addEventListener('resize', buildFilterRow);

$(document).ready(function () {
    HttpService.get('projects')
        .then((projects) => {
            populateData(projects);
        })
        .catch((res) => {
            if (res.status === 404 || res.status === 500) {
                $('html').html(res.responseText);
            }
        });
});

function populateData(list) {
    let numbers = [];
    let managers = [];
    let labels = [];
    let customers = [];

    $(list).each(function (i, project) {
        let $card = $($('#card-template').html()).clone();

        $card.find('.project-number').text(validate(project.number));
        if (!numbers.includes(validate(project.number))) {
            numbers.push(validate(project.number));
        }

        $card.find('.project-manager').text(validate(project.manager));
        $card.find('.project-manager').prop('title', validate(project.manager));
        if (!managers.includes(validate(project.manager))) {
            managers.push(validate(project.manager));
        }

        $card.find('.project-label').text(validate(project.label));
        $card.find('.project-label').prop('title', validate(project.label));
        if (!labels.includes(validate(project.label))) {
            labels.push(validate(project.label));
        }

        let nextMilestone = new Date(project.nextMilestone);

        $card.find('.project-milestone').text(formatDate(nextMilestone));

        $card.find('.project-customer').text(validate(project.customer));
        $card
            .find('.project-customer')
            .prop('title', validate(project.customer));
        if (!customers.includes(validate(project.customer))) {
            customers.push(validate(project.customer));
        }

        $card.find('.project-employees').text(validate(project.employeeCount));

        $('#card-container').append($card);
        $('.card')
            .last()
            .on('click', () => showDetail(project.id));
    });
    $('#busy-indicator').hide();
    $('body').append('<div id="load-finished"></div>');

    createFilters(numbers, managers, labels, customers);

    // TODO why you not work?!
    // $('[data-toggle="tooltip"]').tooltip();
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
