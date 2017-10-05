'use strict';

var holder = document.getElementById('drop');
var hexFile;

holder.ondragover = () => {
	return false;
};

holder.ondragleave = () => {
	return false;
};

holder.ondragend = () => {
	return false;
};

holder.ondrop = (e) => {
	e.preventDefault();

	for (let f of e.dataTransfer.files) {
		hexFile = f.path;
		console.log('File(s) you dragged here: ', f.path);
	}

	return false;
};

function getHexFile() {
	return hexFile;
}
