var uploadForm = document.querySelector('#uploadForm');
var uploadField = document.querySelector('#uploadField');
var uploadContainer = document.querySelector('#uploadContainer');
var theErrorMessage = document.querySelector('#errorMessage');
var theSuccessMessage = document.querySelector('#successMessage');
var clearFileButton = document.querySelector('#clearFile');

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
    uploadContainer.addEventListener(dragEvent, preventDragDefault);
});

['dragover', 'dragenter'].forEach(function(dragEvent) {
    uploadContainer.addEventListener(dragEvent, function () {
        uploadContainer.classList.add('dragging');
    })
});

['dragleave', 'dragend', 'drop'].forEach(function(dragEvent) {
    uploadContainer.addEventListener(dragEvent, function () {
        uploadContainer.classList.remove('dragging');
    })
});

clearFileButton.onclick = clearFileTag;

uploadContainer.addEventListener('drop', function (e) {
    if(e.dataTransfer.files.length > 1) {
        theErrorMessage.innerHTML = "Drag only one file...";
        theErrorMessage.classList.remove('hide');
        return false;
    }
    var theFile = e.dataTransfer.files[0];
    uploadField.files[0] = theFile;

    if(checkFileProperties(theFile)) {
        handleUploadedFile(theFile);
    }
})

uploadField.onchange = function (e) {
    var theFile = e.target.files[0];

    if(checkFileProperties(theFile)) {
        handleUploadedFile(theFile);
    }

}

 function checkFileProperties(theFile) {
     theErrorMessage.classList.add('hide');
     theSuccessMessage.classList.add('hide');
	
     if (theFile.size > 500000) {
         console.log('File too large');
         theErrorMessage.innerHTML = "File too large, cannot be more than 500KB...";
         theErrorMessage.classList.remove('hide');
         return false;
     }

     return true;

 }

uploadForm.onsubmit = function (e) {
    e.preventDefault();
	
	if(fileContent === "") {
		theErrorMessage.innerHTML = "No File selected";
		theErrorMessage.classList.remove('hide');
	}
	else
    {
		jQuery.ajax({
			method: 'POST',
			url: '/upload',
			data: {
				name: fileName,
				content: fileContent
			}
		})
		.done(function (resp) {
			if(resp === "UPLOADED") {
				theSuccessMessage.innerHTML = "Image uploaded successfully";
				theSuccessMessage.classList.remove('hide');
			}
		});
	}
}

function handleUploadedFile(file) {
	clearFileTag();
    fileName = file.name;
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function (evt) {
		fileContent = evt.target.result;
	}
	reader.onerror = function (evt) {
		theErrorMessage.innerHTML = "Error while uploading";
		theErrorMessage.classList.remove('hide');
	}
	
	var fileTag = document.createElement("p");
 	fileTag.setAttribute('id', 'fileTag');
	fileTag.innerHTML = fileName;
	uploadContainer.prepend(fileTag);
	uploadInfo.classList.add('hide');
	clearFileButton.classList.remove('hide');
	uploadContainer.classList.add('uploadContainer-filled');
}

function clearFileTag(e) {
    if(e) {
        e.preventDefault();
    }

    var fileTag = document.querySelector('#fileTag');

    if(fileTag) {
        uploadContainer.removeChild(fileTag);
        uploadField.value = null;
    }

	uploadInfo.classList.remove('hide');
	clearFileButton.classList.add('hide');
	uploadContainer.classList.remove('uploadContainer-filled');
    theErrorMessage.classList.add('hide');
    theSuccessMessage.classList.add('hide');
}


function preventDragDefault(e) {
    e.preventDefault();
    e.stopPropagation();
}