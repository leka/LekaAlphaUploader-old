'use strict';

const exec = require('child_process');

let hexFile = getHexFile();

function update() {
	console.log(hexFile);

	var avrdudePath = './bin/avrdude ';
	var avrdudeConfPath = './bin/osx-avrdude.conf';
	var avrdudeCommand = avrdudePath + '-v -p atmega2560 -C ' + avrdudeConfPath + ' -D -c wiring -b 115200 -P /dev/tty.usbmodem* -U flash:w:' + hexFile + ':i';

	console.log(avrdudeCommand);

	exec(avrdudeCommand, (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return;
		}
		if (stdout) {
			console.log('stdout: ' + stdout);
		}
		if (stderr) {
			console.log('stderr: ' + stderr);
		}
	});
}

var updateButtonEl = document.getElementById('updateButton');

updateButtonEl.addEventListener('click', update);
