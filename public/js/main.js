var datafilepath = '/data/project_sample_data.json';

function validate(value) {
    if (value === null || value === undefined) return '&ndash;';

    return value;
}

function formatDate(date) {
    if (date === null || date === undefined) return '&ndash;';

    let dateInstance;
    if (typeof date !== 'string') {
        if (date instanceof Date) dateInstance = date;
        else return '&ndash;';
    } else date = new Date(date);

    return date.toLocaleDateString('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}
