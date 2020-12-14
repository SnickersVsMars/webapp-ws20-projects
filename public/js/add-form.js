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

var emptyStringsAndZerosToNulls = function (val, inputName) {
    if (val === '') return null; // parse empty strings as nulls
    return val;
};

const handleFormSubmit = (form) => {
    data = $(form).find('input').not('[value=""]').serializeJSON();
    console.log(data);
    HttpService.post('projects/add', data).done((res) => {
        console.log(res);
    });
};
