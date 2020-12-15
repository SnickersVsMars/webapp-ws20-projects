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
    HttpService.post('projects/', data).done((res) => {
        console.log(res);
        // TODO redirect to received ID detail
        // if error: map to UI instead and don't redirect
    });
};
