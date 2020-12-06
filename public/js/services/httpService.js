const HttpService = (function () {
    const pathPrefix = '/api/';

    return {
        get: function (path) {
            return $.ajax({
                url: pathPrefix + path,
                dataType: 'json',
                type: 'GET',
                cache: false,
            });
        },

        post: function (path, body) {
            return $.ajax({
                url: pathPrefix + path,
                dataType: 'json',
                type: 'POST',
                data: body,
                cache: false,
            });
        },

        put: function (path, body) {
            return $.ajax({
                url: pathPrefix + path,
                dataType: 'json',
                type: 'PUT',
                data: body,
                cache: false,
            });
        },
    };
})();
