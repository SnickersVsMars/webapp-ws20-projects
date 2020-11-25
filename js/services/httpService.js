// TODO uncomment
// const pathPrefix = "localhost:8080/api/";
const pathPrefix = "";

function get(path) {
    return $.ajax({
        url: pathPrefix + path,
        dataType: "json",
        type: "GET",
        cache: false,
    });
}

function post(path, body) {
    $.ajax({
        url: pathPrefix + path,
        dataType: "json",
        type: "POST",
        data: body,
        cache: false,
    });
}

function put(path, body) {
    $.ajax({
        url: pathPrefix + path,
        dataType: "json",
        type: "PUT",
        data: body,
        cache: false,
    });
}
