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

// A handler function to prevent default submission and run our custom script.
const formToJSON = (elements) =>
    [].reduce.call(
        elements,
        (data, element) => {
            // Make sure the element has the required properties.
            if (isValidElement(element) && isValidValue()) {
                data[element.name] = element.value;
            }
            if (isCheckbox(element)) {
                data[element.name] = (data[element.name] || []).concat(
                    element.value
                );
            } else if (isMultiSelect(element)) {
                data[element.name] = getSelectValues(element);
            } else {
                data[element.name] = element.value;
            }
            return data;
        },
        {}
    );

// Checks if an element’s value can be saved (e.g. not an unselected checkbox)
const isValidValue = (element) => {
    return !['checkbox', 'radio'].includes(element.type) || element.checked;
};

// Checks if an input is a checkbox, because checkboxes allow multiple values.
const isCheckbox = (element) => element.type === 'checkbox';

//Checks if an input is a `select` with the `multiple` attribute.
const isMultiSelect = (element) => element.options && element.multiple;

// Retrieves the selected options from a multi-select as an array.
const getSelectValues = (options) =>
    [].reduce.call(
        options,
        (values, option) => {
            return option.selected ? values.concat(option.value) : values;
        },
        []
    );

    // This is used as the initial value of `data` in `reducerFunction()`.
    const reducerInitialValue = {};
    // To help visualize what happens, log the inital value.
    console.log('Initial `data` value:', JSON.stringify(reducerInitialValue));
    // Now we reduce by `call`-ing `Array.prototype.reduce()` on `elements`.
    const formData = [].reduce.call(
        elements,
        reducerFunction,
        reducerInitialValue
    );
    // The result is then returned for use elsewhere.
    return formData;
};

formToJSON_deconstructed(form.elements);

//Checks that an element has a non-empty `name` and `value` property.

const isValidElement = (element) => {
    return element.name && element.value;
};

