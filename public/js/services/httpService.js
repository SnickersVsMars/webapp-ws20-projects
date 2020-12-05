const pathPrefix = '/api/';

function get(path) {
    return $.ajax({
        // TODO remove endsWith once all data comes from db
        url: path.endsWith('.json') ? path : pathPrefix + path,
        dataType: 'json',
        type: 'GET',
        cache: false,
    });
}

function post(path, body) {
    return $.ajax({
        // TODO remove endsWith once all data comes from db
        url: path.endsWith('.json') ? path : pathPrefix + path,
        dataType: 'json',
        type: 'POST',
        data: body,
        cache: false,
    });
}

function put(path, body) {
    return $.ajax({
        // TODO remove endsWith once all data comes from db
        url: path.endsWith('.json') ? path : pathPrefix + path,
        dataType: 'json',
        type: 'PUT',
        data: body,
        cache: false,
    });
}
