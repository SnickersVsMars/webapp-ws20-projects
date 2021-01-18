const $uploadInfo = $('#uploadInfo');
const $uploadForm = $('#uploadForm');
const $uploadField = $('#uploadField');
const $uploadContainer = $('#uploadContainer');
const $theErrorMessage = $('#errorMessage');
const $theSuccessMessage = $('#successMessage');
const $clearFileButton = $('#clearFile');

let fileName = '';
let fileContent = '';

[
    'drag',
    'dragstart',
    'dragend',
    'dragover',
    'dragenter',
    'dragleave',
    'drop',
].forEach(function (dragEvent) {
    $uploadContainer.on(dragEvent, preventDragDefault);
});

['dragover', 'dragenter'].forEach(function (dragEvent) {
    $uploadContainer.on(dragEvent, function () {
        $uploadContainer.addClass('dragging');
    });
});

['dragleave', 'dragend', 'drop'].forEach(function (dragEvent) {
    $uploadContainer.on(dragEvent, function () {
        $uploadContainer.removeClass('dragging');
    });
});

$clearFileButton.click(clearFileTag);

$uploadContainer.on('drop', function (e) {
    if (e.originalEvent.dataTransfer.files.length > 1) {
        $theErrorMessage.text('Bitte maximal eine Datei auswählen...');
        $theErrorMessage.show();
        return false;
    }
    let theFile = e.originalEvent.dataTransfer.files[0];
    $uploadField[0].files[0] = theFile;

    if (checkFileProperties(theFile)) {
        handleUploadedFile(theFile);
    }
});

$uploadField.change(function (e) {
    let theFile = e.target.files[0];

    if (checkFileProperties(theFile)) {
        handleUploadedFile(theFile);
    }
});

function checkFileProperties(theFile) {
    $theErrorMessage.hide();
    $theSuccessMessage.hide();

    if (theFile.size > 10000000) {
        $theErrorMessage.text(
            'Die ausgewählte Datei ist zu groß. Maximal sind 10MB möglich.'
        );
        $theErrorMessage.hide();
        return false;
    }

    return true;
}

$uploadForm.submit(function (e) {
    e.preventDefault();

    if (fileContent === '') {
        $theErrorMessage.text('Keine Datei ausgewählt.');
        $theErrorMessage.show();
    } else {
        HttpService.post('projects/upload', {
            name: fileName,
            content: fileContent,
            project_id: $('input#project_id').val(),
        })
            .done(function (resp) {
                if (resp !== undefined) {
                    clearFileTag();
                    $theSuccessMessage.text('Erfolgreich!');
                    $theSuccessMessage.show();
                    addFile({ filename: fileName, id: resp.insertId });
                    fileName = '';
                }
            })
            .fail(function (XMLHttpRequest) {
                clearFileTag();
                $theErrorMessage.text(
                    XMLHttpRequest.responseText.replace(/['"]+/g, '')
                );
                $theErrorMessage.show();
                fileName = '';
            });
    }
});

function handleUploadedFile(file) {
    clearFileTag();
    fileName = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (evt) {
        fileContent = evt.target.result;
    };
    reader.onerror = function (evt) {
        $theErrorMessage.text('Fehler beim Hochladen!');
        $theErrorMessage.show();
    };

    let $fileTag = $('<p></p>').attr('id', 'fileTag').html(fileName);
    $uploadContainer.prepend($fileTag);
    $uploadInfo.hide();
    $clearFileButton.show();
    $uploadContainer.addClass('$uploadContainer-filled');
}

function clearFileTag(e) {
    if (e) {
        e.preventDefault();
    }

    let fileTag = $('#fileTag');

    if (fileTag) {
        fileTag.remove();
        $uploadField.val(null);
    }

    $uploadInfo.show();
    $clearFileButton.hide();
    $uploadContainer.removeClass('$uploadContainer-filled');
    $theErrorMessage.hide();
    $theSuccessMessage.hide();
}

function preventDragDefault(e) {
    e.preventDefault();
    e.stopPropagation();
}
