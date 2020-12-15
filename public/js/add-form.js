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

const handleFormSubmit = (form) => {
    data = $(form).serializeJSON({
        skipFalsyValuesForTypes: ['string'],
    });
    HttpService.post('projects/add', data).done((res) => {
        console.log(res);
        if (res.code !== 200) {
            alert('Fehler');
        } else {
            // do redirect
        }

        // TODO redirect to received ID detail
        // if error: map to UI instead and don't redirect
    });
};
