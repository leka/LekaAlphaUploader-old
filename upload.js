'use strict';

const os = require('os');
const {exec} = require('child_process');

const updateButtonEl = document.getElementById('updateButton');

function setCommand() {
	if (os.type() == 'Darwin') {
		const avrdude = './bin/avrdude';
		const conf    = '-C ./bin/osx-avrdude.conf'
		const flags   = '-v -p atmega2560 -D -c wiring -b 115200 -P /dev/tty.usbmodem*'
		const flash   = '-U flash:w:' + hexFile + ':i';
	}

	if (os.type() == 'Windows_NT') {
		const avrdude = './bin/avrdude.exe';
		const conf    = '-C ./bin/windows-avrdude.conf'
		const flags   = '-v -p atmega2560 -D -c wiring -b 115200 -P COM*'
		const flash   = '-U flash:w:' + hexFile + ':i';
	}

	return [avrdude, conf, flags, flash].join(" ");
}

function update() {
	console.log("Hex file path: " + hexFile);

	const command = setCommand();

	console.log(command);

	exec(command, (err, stdout, stderr) => {
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

updateButtonEl.addEventListener('click', update);
