let numberFilter = [];
let managerFilter = [];
let labelFilter = [];
let customerFilter = [];
let dateSelected = false;
let start = moment();
let end = moment().add(30, 'days');

$('#search-box').val('');
$('.filter-search').val('');

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
            $(
                '<div class="custom-control custom-checkbox dropdown-item">'
            ).append(
                $(
                    `<input type="checkbox" class="custom-control-input" id="${id}-${i}">`
                ).on('click', () => handleChecked()),
                $(
                    `<label class="custom-control-label" id="${id}-${i}-label" for="${id}-${i}">`
                ).text(val)
            )
        );
    });
}

$('#search-box').on('input', function () {
    let text = $(this).val().toLowerCase().trim();

    $('#card-container .card').filter(function () {
        $(this).toggle($(this).text().toLowerCase().includes(text));
    });
});

$('.dropdown-menu').on('click', function (e) {
    e.stopPropagation();
});

function searchFilter(el, filterID) {
    let text = $(el).val().toLowerCase().trim();
    $(`#${filterID} .dropdown-item`).filter(function () {
        $(this).toggle(
            $(this)
                .children('.custom-control-label')
                .text()
                .toLowerCase()
                .includes(text)
        );
    });
}

function handleChecked() {
    removeFilters();
    if (
        $('.dropdown-item .custom-control-input:checkbox:checked').length === 0
    ) {
        $('#clear-filter-btn').css('display', 'none');
        return;
    }

    if ($('#clear-filter-btn').is(':hidden')) {
        $('#clear-filter-btn').css('display', 'block');
    }

    $('.dropdown-item .custom-control-input:checkbox:checked').each(
        function () {
            let id = $(this)[0].id;
            let prop = id.split('-')[0];
            switch (prop) {
                case 'number':
                    numberFilter.push(
                        $(this).siblings('.custom-control-label').text()
                    );
                    break;
                case 'manager':
                    managerFilter.push(
                        $(this).siblings('.custom-control-label').text()
                    );
                    break;
                case 'label':
                    labelFilter.push(
                        $(this).siblings('.custom-control-label').text()
                    );
                    break;
                case 'customer':
                    customerFilter.push(
                        $(this).siblings('.custom-control-label').text()
                    );
                    break;
            }

            applyFilters();
        }
    );
}

function clearAllFilters() {
    $('#clear-filter-btn').css('display', 'none');
    $('#clear-date-btn').css('display', 'none');

    removeFilters();

    $('.dropdown-item .custom-control-input:checkbox:checked').each(
        function () {
            $(this).prop('checked', false);
        }
    );
}

function removeFilters() {
    numberFilter = [];
    managerFilter = [];
    labelFilter = [];
    customerFilter = [];
    start = moment();
    end = moment().add(30, 'days');
    dateSelected = false;

    cb(start, end);

    $('#card-container .card').filter(function () {
        $(this).toggle(true);
    });
}

function clearDate() {
    start = moment();
    end = moment().add(30, 'days');
    dateSelected = false;

    cb(start, end);
    // in case there are other filters active
    applyFilters();

    $('#clear-date-btn').css('display', 'none');
    if (
        $('.dropdown-item .custom-control-input:checkbox:checked').length === 0
    ) {
        $('#clear-filter-btn').css('display', 'none');
    }
}

function applyFilters() {
    $('#card-container .card').filter(function () {
        let numberMatch =
            numberFilter.length === 0 ||
            numberFilter.includes($(this).find('.project-number').text());
        let managerMatch =
            managerFilter.length === 0 ||
            managerFilter.includes($(this).find('.project-manager').text());
        let labelMatch =
            labelFilter.length === 0 ||
            labelFilter.includes($(this).find('.project-label').text());
        let customerMatch =
            customerFilter.length === 0 ||
            customerFilter.includes($(this).find('.project-customer').text());
        let nextMilestone = new Date($(this).find('.project-milestone').text());
        let dateMatch =
            !dateSelected ||
            (start < moment(nextMilestone) && end > moment(nextMilestone));

        $(this).toggle(
            numberMatch &&
                managerMatch &&
                labelMatch &&
                customerMatch &&
                dateMatch
        );
    });
}

function cb(start, end) {
    if (dateSelected) {
        $('#reportrange span').html(
            formatDate(start.toDate()) + ' - ' + formatDate(end.toDate())
        );
    } else {
        $('#reportrange span').html('');
    }
}

$('#reportrange').daterangepicker(
    {
        startDate: start,
        endDate: end,
        autoUpdateInput: false,
        ranges: {
            Heute: [moment(), moment()],
            Morgen: [moment().add(1, 'days'), moment().add(1, 'days')],
            'Nächsten 7 Tage': [moment(), moment().add(7, 'days')],
            'Nächsten 30 Tage': [moment(), moment().add(30, 'days')],
            'Dieser Monat': [
                moment().startOf('month'),
                moment().endOf('month'),
            ],
            'Nächster Monat': [
                moment().add(1, 'months').startOf('month'),
                moment().add(1, 'months').endOf('month'),
            ],
            'Dieses Quartal': [
                moment().startOf('quarter'),
                moment().endOf('quarter'),
            ],
            'Nächstes Quartal': [
                moment().add(1, 'quarters').startOf('quarter'),
                moment().add(1, 'quarters').endOf('quarter'),
            ],
        },
        locale: {
            format: 'MM.DD.YYYY',
            separator: ' - ',
            applyLabel: 'Bestätigen',
            cancelLabel: 'Abbrechen',
            fromLabel: 'Von',
            toLabel: 'Bis',
            customRangeLabel: 'Eigener Bereich',
            weekLabel: 'W',
            daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            monthNames: [
                'Januar',
                'Februar',
                'März',
                'April',
                'Mai',
                'Juni',
                'Juli',
                'August',
                'September',
                'Oktober',
                'November',
                'Dezember',
            ],
            firstDay: 1,
        },
    },
    cb
);

$('#reportrange').on('apply.daterangepicker', function (ev, picker) {
    if (!dateSelected) {
        dateSelected = true;

        if ($('#clear-filter-btn').is(':hidden')) {
            $('#clear-filter-btn').css('display', 'block');
        }
        if ($('#clear-date-btn').is(':hidden')) {
            $('#clear-date-btn').css('display', 'block');
        }
    }
    start = picker.startDate;
    end = picker.endDate;
    cb(start, end);
    applyFilters();
});
