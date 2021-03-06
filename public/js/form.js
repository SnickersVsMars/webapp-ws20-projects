(function () {
    'use strict';
    window.addEventListener(
        'load',
        function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            let $forms = $('.needs-validation');

            // Loop over them and prevent submission
            Array.prototype.filter.call($forms, function (form) {
                form.addEventListener(
                    'submit',
                    function (event) {
                        $('#milestone-error').children().remove();

                        event.preventDefault();
                        event.stopPropagation();

                        if (form.checkValidity()) {
                            handleFormSubmit(form);
                        }
                        form.classList.add('was-validated');
                    },
                    false
                );
            });
        },
        false
    );
})();

const handleSubmitResult = (res) => {
    if (typeof res === 'number') {
        location.href = '/projects/' + res;
        return;
    }

    for (const [key, value] of Object.entries(res.responseJSON.errors)) {
        if (key === 'milestones') {
            $('#milestone-error').append(
                '<div class="alert alert-danger" role="alert">' +
                    value +
                    '</div>'
            );
            return;
        }

        let element;

        if (key.includes('milestones[')) {
            let re = /\[\d+\]/;
            let match = key.match(re)[0];
            let keyIndex = parseInt(match.substring(1, match.length - 1));

            re = /\]\..*/;
            match = key.match(re)[0];
            let name =
                '[name="milestones[][' +
                match.substring(2, match.length) +
                ']"]';

            $(name).each((index, item) => {
                if (index === keyIndex) {
                    element = $(item);
                }
            });
        } else {
            element = $('[name ="' + key + '"]');
        }

        element.addClass('is-invalid');
        let feedback = element.siblings('.invalid-feedback');
        if (feedback.length >= 1) feedback.text(value);
        else
            element
                .parent()
                .append('<div class="invalid-feedback">' + value + '</div>');
    }
};

const handleFormSubmit = (form) => {
    data = $(form).serializeJSON({
        skipFalsyValuesForTypes: ['string'],
    });
    if (data.hasOwnProperty('projectId')) {
        HttpService.put('projects/' + data.projectId, data).always(
            handleSubmitResult
        );
    } else {
        HttpService.post('projects', data).always(handleSubmitResult);
    }
};
