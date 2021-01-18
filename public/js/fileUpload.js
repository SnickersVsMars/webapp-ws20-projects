var uploadInfo = $('#uploadInfo');
var uploadForm = $('#uploadForm');
var uploadField = $('#uploadField');
var uploadContainer = $('#uploadContainer');
var theErrorMessage = $('#errorMessage');
var theSuccessMessage = $('#successMessage');
var clearFileButton = $('#clearFile');

var fileName = "";
var fileContent = "";

[
    'drag', 
    'dragstart', 
    'dragend', 
    'dragover', 
    'dragenter', 
    'dragleave',
    'drop' 
].forEach(function (dragEvent) {
    uploadContainer[0].addEventListener(dragEvent, preventDragDefault);
});

['dragover', 'dragenter'].forEach(function(dragEvent) {
    uploadContainer[0].addEventListener(dragEvent, function () {
        uploadContainer[0].classList.add('dragging');
    })
});

['dragleave', 'dragend', 'drop'].forEach(function(dragEvent) {
    uploadContainer[0].addEventListener(dragEvent, function () {
        uploadContainer[0].classList.remove('dragging');
    })
});

clearFileButton.click(clearFileTag);

uploadContainer[0].addEventListener('drop', function (e) {
    if(e.dataTransfer.files.length > 1) {
        theErrorMessage.innerHTML = "Bitte maximal eine Datei auswählen...";
        theErrorMessage.classList.remove('hide');
        return false;
    }
    var theFile = e.dataTransfer.files[0];
    uploadField[0].files[0] = theFile;

    if(checkFileProperties(theFile)) {
        handleUploadedFile(theFile);
    }
})

uploadField.change(function (e) {
    var theFile = e.target.files[0];

    if(checkFileProperties(theFile)) {
        handleUploadedFile(theFile);
    }

});

 function checkFileProperties(theFile) {
     theErrorMessage.addClass('hide');
     theSuccessMessage.addClass('hide');
	
     if (theFile.size > 10000000) {
         theErrorMessage.html("Die ausgewählte Datei ist zu groß. Maximal sind 10MB möglich.");
         theErrorMessage.removeClass('hide');
         return false;
     }

     return true;

 }

uploadForm.submit(function (e) {
    e.preventDefault();
    
	if(fileContent === "") {
		theErrorMessage.html("Keine Datei ausgewählt.");
		theErrorMessage.removeClass('hide');
	}
	else
    {
		jQuery.ajax({
			method: 'POST',
			url: '../api/projects/upload',
			data: {
				name: fileName,
                content: fileContent,
                project_id: $('input#project_id').val()
            }
		})
		.done(function (resp) {
			if(resp !== undefined) {
                clearFileTag();
				theSuccessMessage.html("Erfolgreich!");
                theSuccessMessage.removeClass('hide');
                addFile({filename:fileName, id:resp.insertId});
                fileName = "";
			}
        }).fail(function (XMLHttpRequest)  {
            clearFileTag();
            theErrorMessage.html(XMLHttpRequest.responseText.replace(/['"]+/g, ''));
            theErrorMessage.removeClass('hide');
            fileName = "";
        });
	}
});

function handleUploadedFile(file) {
	clearFileTag();
    fileName = file.name;
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function (evt) {
		fileContent = evt.target.result;
	}
	reader.onerror = function (evt) {
		theErrorMessage.html("Fehler beim Hochladen!");
		theErrorMessage.removeClass('hide');
	}
	
	var fileTag = $("<p></p>").attr("id","fileTag").html(fileName);
	uploadContainer.prepend(fileTag);
	uploadInfo.addClass('hide');
	clearFileButton.removeClass('hide');
	uploadContainer.addClass('uploadContainer-filled');
}

function clearFileTag(e) {
    if(e) {
        e.preventDefault();
    }

    var fileTag = $('#fileTag');

    if(fileTag) {
        fileTag.remove();
        uploadField.val(null);
    }

	uploadInfo.removeClass('hide');
	clearFileButton.addClass('hide');
	uploadContainer.removeClass('uploadContainer-filled');
    theErrorMessage.addClass('hide');
    theSuccessMessage.addClass('hide');
}


function preventDragDefault(e) {
    e.preventDefault();
    e.stopPropagation();
}