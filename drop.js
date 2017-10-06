'use strict';

const dropZoneEl = document.getElementById('dropZone');
const dropInstructionEl = document.getElementById('dropInstruction');
const updateButtonEl = document.getElementById('updateButton');

let hexPath;

function setReaction (string, color, duration = 0.5) {
	dropZoneEl.style = 'background: ' + color + '; transition: ' + duration + 's;';
	dropInstructionEl.innerHTML = string;
}

dropZoneEl.ondragover = () => {
	return false;
}

dropZoneEl.ondragenter = (e) => {
	setReaction("Yep here! That's right! :)", "#4CAF50");
	return false;
};

dropZoneEl.ondragleave = () => {
	setReaction("Oooh!... Come back! :(", "#EEEEEE");

	setTimeout(function(){
		setReaction("Drag and drop the <code>.hex</code> file here.", "#EEEEEE");
	}, 3000);

	return false;
};

dropZoneEl.ondragend = () => {
	setReaction("Drag and drop the <code>.hex</code> file here.", "#EEEEEE")
	return false;
};

dropZoneEl.ondrop = function (e) {

	e.preventDefault();
	dropZoneEl.style = "background: #EEEEEE; transition: 0.5s;";

	if (e.dataTransfer.files.length != 1) {
		dropInstructionEl.innerHTML = "Only one file should be dropped. Please try again."
		updateButtonEl.disabled = true;
		return false;
	}

	const file          = e.dataTransfer.files[0];
	const fileName      = file.name;
	const filePath      = file.path;
	const fileExtension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);

	if (fileExtension != 'hex') {
		dropInstructionEl.innerHTML = 'You dropped a <code>' + fileExtension + '</code> file.</br>The file must be a <code>.hex</code> file. Please try again.'
		updateButtonEl.disabled = true;
		return false;
	}

	hexPath = filePath;
	dropInstructionEl.innerHTML = 'Well done! We are about to upload <code>'+ fileName + '</code></br>You can now click the Update button bellow.'
	updateButtonEl.disabled = false;

	return false;
};
