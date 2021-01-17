function validate(value) {
    if (value === null || value === undefined || value === '') {
        return '&ndash;';
    }

    return value;
}

function formatDate(date) {
    if (date === null || date === undefined) {
        return '&ndash;';
    }

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

function setDescription($el, description) {
    if (
        description === null ||
        description === undefined ||
        description === ''
    ) {
        $el.html('&ndash;');
    } else {
        $el.text(description);
    }
}
