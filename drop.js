'use strict';

const dropZone = document.getElementById('dropZone');
const dropInstruction = document.getElementById('dropInstruction');

let hexPath;

function setReaction (string, color, duration = 0.5) {
	dropZone.style = 'background: ' + color + '; transition: ' + duration + 's;';
	dropInstruction.innerHTML = string;
}

dropZone.ondragover = () => {
	return false;
}

dropZone.ondragenter = (e) => {
	setReaction("Yep here! That's right! :)", "#4CAF50");
	return false;
};

dropZone.ondragleave = () => {
	setReaction("Oooh!... Come back! :(", "#EEEEEE");

	setTimeout(function(){
		setReaction("Drag and drop the <code>.hex</code> file here.", "#EEEEEE");
	}, 3000);

	return false;
};

dropZone.ondragend = () => {
	setReaction("Drag and drop the <code>.hex</code> file here.", "#EEEEEE")
	return false;
};

dropZone.ondrop = function (e) {

	e.preventDefault();
	dropZone.style = "background: #EEEEEE; transition: 0.5s;";

	if (e.dataTransfer.files.length != 1) {
		dropInstruction.innerHTML = "Only one file should be dropped. Please try again."
		return false;
	}

	const file          = e.dataTransfer.files[0];
	const fileName      = file.name;
	const filePath      = file.path;
	const fileExtension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);

	if (fileExtension != 'hex') {
		dropInstruction.innerHTML = 'You dropped a <code>' + fileExtension + '</code> file.</br>The file must be a <code>.hex</code> file. Please try again.'
		return false;
	}

	hexPath = filePath;
	dropInstruction.innerHTML = 'Well done! We are about to upload <code>'+ fileName + '</code></br>You can now click the Upload button bellow.'

	return false;
};
