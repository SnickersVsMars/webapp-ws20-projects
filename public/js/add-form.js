(function () {
    'use strict';
    window.addEventListener(
        'load',
        function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(
                forms,
                function (form) {
                    form.addEventListener(
                        'submit',
                        function (event) {
                            if (form.checkValidity() === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            } else {
                                // We need to submit the form here -> make JSON and send to server and wait for request
                                handleFormSubmit(form);
                            }
                            form.classList.add('was-validated');
                        },
                        false
                    );
                }
            );
        },
        false
    );
})();

const isValidElement = (element) => {
    return element.name && element.value;
};

const isArrayInput = (element) => element.class === 'input-array';

const formToJSON = (elements) =>
    [].reduce.call(
        elements,
        (data, element) => {
            if (isValidElement(element)) {
                if (isArrayInput(element)) {
                    data[element.name] = (data[element.name] || []).concat(
                        element.value
                    );
                } else {
                    data[element.name] = element.value;
                }
            }
            return data;
        },
        {}
    );

const handleFormSubmit = (form) => {
    // Call our function to get the form data.
    const data = formToJSON(form.elements);

    // var project = JSON.stringify(data);
    console.log(data);
    // ajax call here
    HttpService.post('projects/add', data).done((res) => {
        console.log(res);
    });
};
