const HttpService = (function () {
    const pathPrefix = '/api/';

    return {
        get: function (path) {
            return $.ajax({
                url: pathPrefix + path,
                dataType: 'json',
                contentType: 'application/json',
                type: 'GET',
                cache: false,
            });
        },

        post: function (path, body) {
            return $.ajax({
                url: pathPrefix + path,
                dataType: 'json',
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify(body),
                cache: false,
            });
        },

        put: function (path, body) {
            return $.ajax({
                url: pathPrefix + path,
                dataType: 'json',
                contentType: 'application/json',
                type: 'PUT',
                data: JSON.stringify(body),
                cache: false,
            });
        },
    };
})();
