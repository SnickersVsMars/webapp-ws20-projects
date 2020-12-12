// {
//     "number": "PR20_0006", "label": "Test-Projekt 6", "description": "Post-Test",
//     "manager": "Michael Lamprecht", "customer": "Snickers vs Mars", "costcenter": "Studenten",
//     "employees": [{ "name": "Islam Hemida"}, { "name": "Martin Guevara-Kunerth" }],
//     "milestones": [{ "date": "2020-12-09", "label": "Start", "description": "Projektstart" },
//     { "date": "2021-12-09", "label": "Ende", "description": "Projektabschluss" }]}

const handleFormSubmit = (event) => {
    // Stop the form from submitting since we’re handling that with AJAX.
    event.preventDefault();
    // TODO: Call our function to get the form data.
    const data = formToJSON(form.elements);
    // Demo only: print the form data onscreen as a formatted JSON object.
    const dataContainer = document.getElementsByClassName(
        'results__display'
    )[0];
    // Use `JSON.stringify()` to make the output valid, human-readable JSON.
    dataContainer.textContent = JSON.stringify(data, null, '  ');
    console.log(dataContainer.textContent);
    //HttpService.post('add', '').done(form);
};

const form = document.getElementById('project_form');
form.addEventListener('submit', handleFormSubmit);
