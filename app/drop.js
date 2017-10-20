'use strict';

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
	setReaction("Drag and drop the <code>.hex</code> file here.", "#EEEEEE");
	return false;
};

dropZoneEl.ondrop = function (e) {

	e.preventDefault();
	dropZoneEl.style = "background: #EEEEEE; transition: 0.5s;";

	if (e.dataTransfer.files.length != 1) {
		dropInstructionEl.innerHTML = 'Only one file should be dropped. Please try again.';
		output('Error: Multiple files dropped');
		setButtonsState('off');
		return false;
	}

	const file          = e.dataTransfer.files[0];
	const fileName      = file.name;
	const filePath      = file.path;
	const fileExtension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);

	if (fileExtension != 'hex') {
		dropInstructionEl.innerHTML = 'You dropped a <code>' + fileExtension + '</code> file.</br>The file must be a <code>.hex</code> file. Please try again.';
		output('Error: non hex file dropped');
		setButtonsState('off');
		return false;
	}

	hexPath = filePath;
	refreshPortList();
	dropInstructionEl.innerHTML = 'Well done! We are about to upload <code>'+ fileName + '</code></br>You can now select the port before pressing the Update button bellow.';
	output('Info: ' + fileName + ' dropped');
	status('Select the port to which your device is connected');

	return false;
};
