// {
//     "number": "PR20_0006", "label": "Test-Projekt 6", "description": "Post-Test",
//     "manager": "Michael Lamprecht", "customer": "Snickers vs Mars", "costcenter": "Studenten",
//     "employees": [{ "name": "Islam Hemida"}, { "name": "Martin Guevara-Kunerth" }],
//     "milestones": [{ "date": "2020-12-09", "label": "Start", "description": "Projektstart" },
//     { "date": "2021-12-09", "label": "Ende", "description": "Projektabschluss" }]}

import FetchService from "/js/FetchService";

const fetchService = new FetchService();

//Event Listener
const form = document.getElementById("project_form");
if (form) {
    form.addEventListener("submit", function (e) {
        submitForm(e, this);
    });
}

async function submitForm(e, form) {
    // verbindet reloading Page
    e.preventDefault();

    //submit the form
    const btnSubmit = document.getElementById("Submit");
    btnSubmit.disable = true;
    setTimeout(() => btnSubmit.disable(form));

    //Build json body
    const jsonFormData = buildJsonFormData(form); //!!!!!

    //Build Headers
    const headers = buildHeader();

    //Request&Respose
    const respose = await fetchService.performPostHttpRequest(
        "https://jsonplacerholder.typicode.com/posts",
        headers,
        jsonFormData
    );
    console.log(respose);

    //informiere User wegen Resultat
    if (response)
        window.location =
            "/add.html?Nummer=${response.input-number}&Manager=${response.input-manager}&Employees=${response.input-employees}" +
            "&Milestones=${response.add-milestones}&Date=${response.input-date}&Label=${response.input-label-td}&Description=${response.input-description-td}";
    else alert("An error occured.");
}

function buildJsonFormData(form) {
    const jsonFormData = {};
    for (const pair of new FormData(form)) {
        jsonFormData[pair[0]] = pair[1];
    }
    return jsonFormData;
}

function buildHeaders(authorization = null) {
    const headers = {
        "Content-Type": "application/json",
        Authorization: authorization ? authorization : "Bearer TOKEN_MISSING",
    };
    return headers;
}
